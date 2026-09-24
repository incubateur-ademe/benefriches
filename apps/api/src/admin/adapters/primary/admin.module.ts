import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import type { AdminStatsQuery } from "src/admin/core/gateways/AdminStatsQuery";
import type { AdminUsersQuery } from "src/admin/core/gateways/AdminUsersQuery";
import { ADMINISTRATOR_QUERY_INJECTION_TOKEN } from "src/admin/core/gateways/AdministratorQuery";
import { GetAdminDashboardStatsUseCase } from "src/admin/core/usecases/getAdminDashboardStats.usecase";
import { GetAdminUserActivityUseCase } from "src/admin/core/usecases/getAdminUserActivity.usecase";
import { ListAdminUsersUseCase } from "src/admin/core/usecases/listAdminUsers.usecase";
import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import { AuthModule } from "src/auth/adapters/auth.module";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import type { DateProvider } from "src/shared-kernel/dateProvider";

import { SqlAdminStatsQuery } from "../secondary/SqlAdminStatsQuery";
import { SqlAdminUsersQuery } from "../secondary/SqlAdminUsersQuery";
import { SqlAdministratorQuery } from "../secondary/SqlAdministratorQuery";
import { AdminGuard } from "./AdminGuard";
import { AdminController } from "./admin.controller";

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [AdminController],
  providers: [
    {
      provide: GetAdminDashboardStatsUseCase,
      useFactory: (adminStatsQuery: AdminStatsQuery, dateProvider: DateProvider) =>
        new GetAdminDashboardStatsUseCase(adminStatsQuery, dateProvider),
      inject: [SqlAdminStatsQuery, RealDateProvider],
    },
    {
      provide: ListAdminUsersUseCase,
      useFactory: (adminUsersQuery: AdminUsersQuery) => new ListAdminUsersUseCase(adminUsersQuery),
      inject: [SqlAdminUsersQuery],
    },
    {
      provide: GetAdminUserActivityUseCase,
      useFactory: (adminUsersQuery: AdminUsersQuery) =>
        new GetAdminUserActivityUseCase(adminUsersQuery),
      inject: [SqlAdminUsersQuery],
    },
    { provide: ADMINISTRATOR_QUERY_INJECTION_TOKEN, useClass: SqlAdministratorQuery },
    SqlAdminStatsQuery,
    SqlAdminUsersQuery,
    RealDateProvider,
    JwtAuthGuard,
    AdminGuard,
  ],
})
export class AdminModule {}
