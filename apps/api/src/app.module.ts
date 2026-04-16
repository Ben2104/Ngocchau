import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { validateEnvironment } from "./config/environment";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { ProductsModule } from "./modules/products/products.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { CashbookModule } from "./modules/cashbook/cashbook.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { ExcelImportModule } from "./modules/excel-import/excel-import.module";
import { AuditLogsModule } from "./modules/audit-logs/audit-logs.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: validateEnvironment
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    EmployeesModule,
    ProductsModule,
    InventoryModule,
    TransactionsModule,
    CashbookModule,
    ReportsModule,
    ExcelImportModule,
    AuditLogsModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
