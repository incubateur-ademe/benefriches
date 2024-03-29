import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { CarbonStorageModule } from "./carbon-storage/adapters/primary/carbonStorage.module";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";
import { LocationFeaturesModule } from "./location-features/adapters/primary/locationFeatures.module";
import { ReconversionProjectsModule } from "./reconversion-projects/adapters/primary/reconversionProjects.module";
import { SqlConnectionModule } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SitesModule } from "./sites/adapters/primary/sites.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SqlConnectionModule,
    HelloModule,
    LocationFeaturesModule,
    CarbonStorageModule,
    SitesModule,
    ReconversionProjectsModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
