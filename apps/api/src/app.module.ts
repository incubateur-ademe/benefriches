import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ZodValidationPipe } from "nestjs-zod";

import { AuthModule } from "./auth/adapters/auth.module";
import { CarbonStorageModule } from "./carbon-storage/adapters/primary/carbonStorage.module";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";
import { MarketingModule } from "./marketing/adapters/primary/marketing.module";
import { PhotovoltaicPerformanceModule } from "./photovoltaic-performance/adapters/primary/photovoltaicPerformance.module";
import { ReconversionProjectsModule } from "./reconversion-projects/adapters/primary/reconversionProjects.module";
import { SqlConnectionModule } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SitesModule } from "./sites/adapters/primary/sites.module";
import { UsersModule } from "./users/adapters/primary/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
    SqlConnectionModule,
    AuthModule,
    HelloModule,
    PhotovoltaicPerformanceModule,
    CarbonStorageModule,
    SitesModule,
    ReconversionProjectsModule,
    UsersModule,
    MarketingModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
