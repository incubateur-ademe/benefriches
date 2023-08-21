import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { CreateUserUseCase } from "src/users/domain/usecases/CreateUser.usecase";
import knex, { Knex } from "knex";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexfile";
import { SqlUserRepository } from "../user-repository/SqlUserRepository";
import { RandomUiidGenerator } from "../uuid-generator/RandomUuidGenerator";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { CryptoHashGenerator } from "../hash-generator/CryptoHashGenerator";
import { LoginUseCase } from "src/users/domain/usecases/Login.usecase";
import { AccessTokenService } from "src/users/domain/gateways/AccessTokenService";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_EXPIRATION },
    }),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: "SqlConnection",
      useValue: knex(knexConfig.test),
    },
    { provide: "UuidGenerator", useClass: RandomUiidGenerator },
    {
      provide: "UserRepository",
      useFactory: (sqlConnection: Knex) => new SqlUserRepository(sqlConnection),
      inject: ["SqlConnection"],
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
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashGenerator: HashGenerator,
        jwtService: AccessTokenService,
      ) => new LoginUseCase(userRepository, hashGenerator, jwtService),
      inject: ["UserRepository", "HashGenerator", JwtService],
    },
  ],
})
export class UsersModule {}
