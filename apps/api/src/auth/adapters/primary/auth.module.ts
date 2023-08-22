import { Knex } from "knex";
import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { LoginUseCase } from "src/auth/domain/usecases/Login.usecase";
import { UserRepository } from "src/users/domain/gateways/UserRepository";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { AccessTokenService } from "src/users/domain/gateways/AccessTokenService";
import { SqlUserRepository } from "src/users/adapters/secondary/user-repository/SqlUserRepository";
import { CryptoHashGenerator } from "src/users/adapters/secondary/hash-generator/CryptoHashGenerator";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>("AUTH_JWT_SECRET"),
          signOptions: {
            expiresIn: configService.getOrThrow<string>("AUTH_JWT_EXPIRATION"),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: "UserRepository",
      useFactory: (sqlConnection: Knex) => new SqlUserRepository(sqlConnection),
      inject: [SqlConnection],
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
