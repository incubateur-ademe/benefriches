import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "src/auth/adapters/auth.module";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import {
  CreateUserFeatureAlertUseCase,
  UserFeatureAlertRepository,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

import { SqlUserFeatureAlertRepository } from "../secondary/user-feature-alert-repository/SqlUserFeatureAlertRepository";
import { UsersController } from "./users.controller";

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserFeatureAlertUseCase,
      useFactory: (
        userFeatureAlertRepository: UserFeatureAlertRepository,
        dateProvider: DateProvider,
      ) => new CreateUserFeatureAlertUseCase(userFeatureAlertRepository, dateProvider),
      inject: [SqlUserFeatureAlertRepository, RealDateProvider],
    },
    SqlUserFeatureAlertRepository,
    RealDateProvider,
  ],
})
export class UsersModule {}
