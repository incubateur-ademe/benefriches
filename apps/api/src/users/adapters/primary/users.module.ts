import { Module } from "@nestjs/common";

import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { CreateUserUseCase, UserRepository } from "src/users/core/usecases/createUser.usecase";

import { SqlUserRepository } from "../secondary/user-repository/SqlUserRepository";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository, dateProvider: IDateProvider) =>
        new CreateUserUseCase(userRepository, dateProvider),
      inject: [SqlUserRepository, DateProvider],
    },
    SqlUserRepository,
    DateProvider,
  ],
})
export class UsersModule {}
