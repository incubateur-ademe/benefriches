import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth/adapters/primary/auth.module";
import { CarbonStorageModule } from "./carbon-storage/adapters/primary/carbonStorage.module";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";
import { LocationFeaturesModule } from "./location-features/adapters/primary/locationFeatures.module";
import { ProjectImpactsModule } from "./project-impacts/adapters/primary/projectImpacts.module";
import { ReconversionProjectsModule } from "./reconversion-projects/adapters/primary/reconversionProjects.module";
import { SqlConnectionModule } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SitesModule } from "./sites/adapters/primary/sites.module";
import { UsersModule } from "./users/adapters/primary/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SqlConnectionModule,
    AuthModule,
    HelloModule,
    UsersModule,
    LocationFeaturesModule,
    CarbonStorageModule,
    ProjectImpactsModule,
    SitesModule,
    ReconversionProjectsModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
