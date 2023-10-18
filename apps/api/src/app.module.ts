import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth/adapters/primary/auth.module";
import { CarbonStorageModule } from "./carbon-storage/adapters/primary/carbonStorage.module";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";
import { LocationFeaturesModule } from "./location-features/adapters/primary/locationFeatures.module";
import { SqlConnectionModule } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";
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
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
