import knex, { Knex } from "knex";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./jwtStrategy";
import { LoginUseCase } from "src/auth/domain/usecases/Login.usecase";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { AccessTokenService } from "src/users/domain/gateways/AccessTokenService";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexfile";
import { SqlUserRepository } from "src/users/adapters/user-repository/SqlUserRepository";
import { CryptoHashGenerator } from "src/users/adapters/hash-generator/CryptoHashGenerator";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: "SqlConnection",
      useValue: knex(knexConfig.test),
    },
    {
      provide: "UserRepository",
      useFactory: (sqlConnection: Knex) => new SqlUserRepository(sqlConnection),
      inject: ["SqlConnection"],
    },
    { provide: "HashGenerator", useClass: CryptoHashGenerator },
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
export class AuthModule {}
