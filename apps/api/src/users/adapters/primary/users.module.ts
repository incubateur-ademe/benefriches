import { Module } from "@nestjs/common";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { CreateUserUseCase, UserRepository } from "src/users/core/usecases/createUser.usecase";

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
    SqlUserRepository,
    RealDateProvider,
  ],
})
export class UsersModule {}
