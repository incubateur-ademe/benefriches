import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import type { AdminStatsQuery } from "src/admin/core/gateways/AdminStatsQuery";
import type { AdminUsersQuery } from "src/admin/core/gateways/AdminUsersQuery";
import { ADMINISTRATOR_QUERY_INJECTION_TOKEN } from "src/admin/core/gateways/AdministratorQuery";
import type { AdministratorRepository } from "src/admin/core/gateways/AdministratorRepository";
import { GetAdminDashboardStatsUseCase } from "src/admin/core/usecases/getAdminDashboardStats.usecase";
import { GetAdminUserActivityUseCase } from "src/admin/core/usecases/getAdminUserActivity.usecase";
import { GrantAdministratorRightsUseCase } from "src/admin/core/usecases/grantAdministratorRights.usecase";
import { ListAdminUsersUseCase } from "src/admin/core/usecases/listAdminUsers.usecase";
import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import { AuthModule } from "src/auth/adapters/auth.module";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";

import { SqlAdminStatsQuery } from "../secondary/SqlAdminStatsQuery";
import { SqlAdminUsersQuery } from "../secondary/SqlAdminUsersQuery";
import { SqlAdministratorQuery } from "../secondary/SqlAdministratorQuery";
import { SqlAdministratorRepository } from "../secondary/SqlAdministratorRepository";
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
    {
      provide: GrantAdministratorRightsUseCase,
      useFactory: (
        administratorRepository: AdministratorRepository,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new GrantAdministratorRightsUseCase(
          administratorRepository,
          dateProvider,
          uidGenerator,
          eventPublisher,
        ),
      inject: [
        SqlAdministratorRepository,
        RealDateProvider,
        RandomUuidGenerator,
        RealEventPublisher,
      ],
    },
    { provide: ADMINISTRATOR_QUERY_INJECTION_TOKEN, useClass: SqlAdministratorQuery },
    SqlAdminStatsQuery,
    SqlAdminUsersQuery,
    SqlAdministratorRepository,
    RealDateProvider,
    RandomUuidGenerator,
    RealEventPublisher,
    JwtAuthGuard,
    AdminGuard,
  ],
  // Resolved by the grantAdministratorRights script.
  exports: [GrantAdministratorRightsUseCase],
})
export class AdminModule {}
