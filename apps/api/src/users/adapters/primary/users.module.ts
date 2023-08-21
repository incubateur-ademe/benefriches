import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { CreateUserUseCase } from "src/users/domain/usecases/CreateUser.usecase";
import { SqlUserRepository } from "../user-repository/SqlUserRepository";
import { RandomUiidGenerator } from "../uuid-generator/RandomUuidGenerator";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { CryptoHashGenerator } from "../hash-generator/CryptoHashGenerator";
import { Knex } from "knex";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Module({
  controllers: [UsersController],
  providers: [
    { provide: "UuidGenerator", useClass: RandomUiidGenerator },
    {
      provide: "UserRepository",
      useFactory: (sqlConnection: Knex) => new SqlUserRepository(sqlConnection),
      inject: [SqlConnection],
    },
    { provide: "HashGenerator", useClass: CryptoHashGenerator },
    {
      provide: CreateUserUseCase,
      useFactory: (
        uuidGenerator: UuidGenerator,
        userRepository: UserRepository,
        hashGenerator: HashGenerator,
      ) => new CreateUserUseCase(uuidGenerator, userRepository, hashGenerator),
      inject: ["UuidGenerator", "UserRepository", "HashGenerator"],
    },
  ],
})
export class UsersModule {}
