import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

import { APP_ROLES, EMPLOYEE_ASSIGNABLE_ROLES } from "@gold-shop/types";

export class ApiMetaDto {
  @ApiProperty({ example: "req_01JABCXYZ" })
  requestId!: string;

  @ApiProperty({ example: "2026-04-17T21:30:00.000Z" })
  timestamp!: string;

  @ApiProperty({ example: "/api/v1/employees" })
  path?: string;
}

export class ApiErrorDto {
  @ApiProperty({ example: "EMPLOYEE_PROFILE_TABLE_MISSING" })
  code!: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Object,
    additionalProperties: true
  })
  details?: Record<string, unknown> | null;
}

export class AuthStatusDto {
  @ApiProperty({ example: "api" })
  service!: string;

  @ApiProperty({ example: "ready" })
  auth!: string;
}

export class AuthenticatedUserDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  supabaseUserId!: string;

  @ApiProperty({ example: "owner@ngocchau.vn" })
  email!: string;

  @ApiProperty({ required: false, nullable: true, example: "Ngọc Châu" })
  fullName?: string | null;

  @ApiProperty({ required: false, nullable: true, example: "EMP-001" })
  employeeId?: string | null;

  @ApiProperty({ enum: APP_ROLES, example: "owner" })
  role!: (typeof APP_ROLES)[number];

  @ApiProperty({ example: "active" })
  status!: string;
}

export class EmployeeCreateRequestDto {
  @ApiProperty({ example: "Trần Hải Yến" })
  fullName!: string;

  @ApiProperty({ example: "nhanvien@ngocchau.vn" })
  email!: string;

  @ApiProperty({ example: "MatKhau123" })
  password!: string;

  @ApiProperty({ enum: EMPLOYEE_ASSIGNABLE_ROLES, example: "staff" })
  role!: (typeof EMPLOYEE_ASSIGNABLE_ROLES)[number];
}

export class EmployeeProfileDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "Trần Hải Yến" })
  fullName!: string;

  @ApiProperty({ example: "THY" })
  initials!: string;

  @ApiProperty({ required: false, nullable: true, example: null })
  avatarUrl?: string | null;

  @ApiProperty({ required: false, example: "nhanvien@ngocchau.vn" })
  email?: string;

  @ApiProperty({ required: false, example: "Nhân viên" })
  subtitle?: string;
}

export class EmployeeListItemDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ type: () => EmployeeProfileDto })
  profile!: EmployeeProfileDto;

  @ApiProperty({ enum: APP_ROLES, example: "staff" })
  role!: (typeof APP_ROLES)[number];

  @ApiProperty({ example: "2026-04-17T20:30:00.000Z" })
  joinedAt!: string;
}

export class EmployeeDirectoryDto {
  @ApiProperty({ type: () => EmployeeListItemDto, isArray: true })
  items!: EmployeeListItemDto[];

  @ApiProperty({ required: false, example: "Starter module for employee roster." })
  note?: string;
}

export class EmployeeDeleteResultDto {
  @ApiProperty({ format: "uuid" })
  id!: string;
}

type SwaggerModel = abstract new (...args: never[]) => unknown;

export function buildSuccessEnvelopeSchema(model: SwaggerModel) {
  return {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true
      },
      message: {
        type: "string",
        example: "Request completed successfully"
      },
      data: {
        $ref: getSchemaPath(model)
      },
      meta: {
        $ref: getSchemaPath(ApiMetaDto)
      }
    },
    required: ["success", "message", "data", "meta"]
  };
}

export function buildErrorEnvelopeSchema(exampleMessage: string, exampleCode: string) {
  return {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false
      },
      message: {
        type: "string",
        example: exampleMessage
      },
      data: {
        nullable: true,
        example: null
      },
      meta: {
        $ref: getSchemaPath(ApiMetaDto)
      },
      error: {
        allOf: [{ $ref: getSchemaPath(ApiErrorDto) }],
        example: {
          code: exampleCode,
          details: {
            tableName: "users"
          }
        }
      }
    },
    required: ["success", "message", "data", "meta", "error"]
  };
}
