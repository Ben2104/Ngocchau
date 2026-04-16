import { BadRequestException, Injectable } from "@nestjs/common";

import { AUDIT_ACTIONS, AUDIT_MODULES } from "@gold-shop/constants";
import type { AuthenticatedUser } from "@gold-shop/types";

import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { ImportSessionRepository } from "../../database/repositories/import-session.repository";
import { ExcelParserService } from "../../integrations/excel/excel-parser.service";
import { StorageService } from "../../integrations/storage/storage.service";

@Injectable()
export class ExcelImportService {
  constructor(
    private readonly importSessionRepository: ImportSessionRepository,
    private readonly storageService: StorageService,
    private readonly excelParserService: ExcelParserService,
    private readonly auditLogsService: AuditLogsService
  ) {}

  async upload(file: Express.Multer.File, actor: AuthenticatedUser) {
    const storagePath = `${actor.supabaseUserId}/${Date.now()}-${file.originalname}`;

    await this.storageService.uploadBuffer(storagePath, file.buffer, file.mimetype);
    const session = await this.importSessionRepository.create(file.originalname, storagePath, actor.supabaseUserId);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.upload,
      entityType: "import-session",
      entityId: session.id,
      moduleName: AUDIT_MODULES.excelImport,
      metadata: {
        fileName: file.originalname,
        storagePath
      }
    });

    return session;
  }

  async validate(sessionId: string, actor: AuthenticatedUser) {
    const session = await this.importSessionRepository.findRowById(sessionId);
    const buffer = await this.storageService.downloadBuffer(session.storage_path);
    const parsedWorkbook = await this.excelParserService.parse(buffer);

    const validationSummary = {
      validRowCount: parsedWorkbook.rows.length,
      invalidRowCount: parsedWorkbook.errors.length,
      errors: parsedWorkbook.errors
    };

    const updatedSession = await this.importSessionRepository.updateValidation(
      sessionId,
      parsedWorkbook.errors.length > 0 ? "validation_failed" : "validated",
      validationSummary,
      parsedWorkbook.rows
    );

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.validate,
      entityType: "import-session",
      entityId: sessionId,
      moduleName: AUDIT_MODULES.excelImport,
      metadata: validationSummary
    });

    return updatedSession;
  }

  async commit(sessionId: string, actor: AuthenticatedUser) {
    const session = await this.importSessionRepository.findRowById(sessionId);

    if (session.status !== "validated") {
      throw new BadRequestException("Import session must be validated before commit");
    }

    const committedSession = await this.importSessionRepository.markCommitted(sessionId);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.commit,
      entityType: "import-session",
      entityId: sessionId,
      moduleName: AUDIT_MODULES.excelImport,
      metadata: {
        rowCount: Array.isArray(session.normalized_rows) ? session.normalized_rows.length : 0,
        note: "Starter commit flow marks the session as committed. Domain inserts should be added next."
      }
    });

    return committedSession;
  }
}

