import { Module } from "@nestjs/common";
import { Knex } from "knex";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";
import { CreateUserUseCase } from "src/users/domain/usecases/CreateUser.usecase";
import { CryptoHashGenerator } from "../secondary/hash-generator/CryptoHashGenerator";
import { SqlUserRepository } from "../secondary/user-repository/SqlUserRepository";
import { RandomUuidGenerator } from "../secondary/uuid-generator/RandomUuidGenerator";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [
    { provide: "UuidGenerator", useClass: RandomUuidGenerator },
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
