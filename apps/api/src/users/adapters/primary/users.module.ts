import { Module } from "@nestjs/common";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { CreateUserUseCase, UserRepository } from "src/users/core/usecases/createUser.usecase";
import {
  CreateUserFeatureAlertUseCase,
  UserFeatureAlertRepository,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

import { SqlUserFeatureAlertRepository } from "../secondary/user-feature-alert-repository/SqlUserFeatureAlertRepository";
import { SqlUserRepository } from "../secondary/user-repository/SqlUserRepository";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository, dateProvider: DateProvider) =>
        new CreateUserUseCase(userRepository, dateProvider),
      inject: [SqlUserRepository, RealDateProvider],
    },
    {
      provide: CreateUserFeatureAlertUseCase,
      useFactory: (
        userFeatureAlertRepository: UserFeatureAlertRepository,
        dateProvider: DateProvider,
      ) => new CreateUserFeatureAlertUseCase(userFeatureAlertRepository, dateProvider),
      inject: [SqlUserFeatureAlertRepository, RealDateProvider],
    },
    SqlUserRepository,
    SqlUserFeatureAlertRepository,
    RealDateProvider,
  ],
})
export class UsersModule {}
