import { Module } from "@nestjs/common";
import {
  CreateIdentityUseCase,
  IdentityRepository,
} from "src/identities/domain/usecases/createIdentity.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SqlIdentityRepository } from "../secondary/identity-repository/SqlIdentityRepository";
import { IdentityController } from "./identities.controller";

@Module({
  controllers: [IdentityController],
  providers: [
    {
      provide: CreateIdentityUseCase,
      useFactory: (identityRepository: IdentityRepository, dateProvider: IDateProvider) =>
        new CreateIdentityUseCase(identityRepository, dateProvider),
      inject: [SqlIdentityRepository, DateProvider],
    },
    SqlIdentityRepository,
    DateProvider,
  ],
})
export class IdentityModule {}
