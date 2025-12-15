import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { EventEmitterModule, OnEvent } from "@nestjs/event-emitter";
import { ZodValidationPipe } from "nestjs-zod";

import { AuthModule } from "./auth/adapters/auth.module";
import { CarbonStorageModule } from "./carbon-storage/adapters/primary/carbonStorage.module";
import { HealthCheckModule } from "./healthcheck/healthcheck.module";
import { MarketingModule } from "./marketing/adapters/primary/marketing.module";
import { PhotovoltaicPerformanceModule } from "./photovoltaic-performance/adapters/primary/photovoltaicPerformance.module";
import { ReconversionCompatibilityModule } from "./reconversion-compatibility/adapters/primary/reconversionCompatibility.module";
import { ReconversionProjectsModule } from "./reconversion-projects/adapters/primary/reconversionProjects.module";
import { DomainEventsRepository } from "./shared-kernel/adapters/events/repository/DomainEventsRepository";
import { SqlDomainEventsRepository } from "./shared-kernel/adapters/events/repository/SqlDomainEventsRepository";
import { SqlConnectionModule } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";
import { DomainEvent } from "./shared-kernel/domainEvent";
import { SiteActionsModule } from "./site-actions/adapters/primary/siteActions.module";
import { SiteEvaluationsModule } from "./site-evaluations/adapters/primary/siteEvaluations.module";
import { SitesModule } from "./sites/adapters/primary/sites.module";
import { UsersModule } from "./users/adapters/primary/users.module";

class DomainEventsHandler {
  constructor(private readonly domainEventRepository: DomainEventsRepository) {}

  @OnEvent("**")
  async saveEvents(event: DomainEvent) {
    await this.domainEventRepository.save(event);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
    SqlConnectionModule,
    AuthModule,
    HealthCheckModule,
    PhotovoltaicPerformanceModule,
    CarbonStorageModule,
    SitesModule,
    ReconversionProjectsModule,
    UsersModule,
    MarketingModule,
    ReconversionCompatibilityModule,
    SiteEvaluationsModule,
    SiteActionsModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    {
      provide: DomainEventsHandler,
      useFactory: (domainEventRepository: DomainEventsRepository) =>
        new DomainEventsHandler(domainEventRepository),
      inject: [SqlDomainEventsRepository],
    },
    SqlDomainEventsRepository,
  ],
})
export class AppModule {}
