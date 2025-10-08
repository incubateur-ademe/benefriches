import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "src/auth/adapters/auth.module";
import { ReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/core/gateways/ReconversionCompatibilityEvaluationRepository";
import { CompleteReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/completeReconversionCompatibilityEvaluation.usecase";
import { StartReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/startReconversionCompatibilityEvaluation.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";

import { SqlReconversionCompatibilityEvaluationRepository } from "../secondary/reconversion-compatibility-evaluation/SqlReconversionCompatibilityEvaluationRepository";
import { ReconversionCompatibilityController } from "./reconversionCompatibility.controller";

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [ReconversionCompatibilityController],
  providers: [
    {
      provide: StartReconversionCompatibilityEvaluationUseCase,
      useFactory: (
        repository: ReconversionCompatibilityEvaluationRepository,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new StartReconversionCompatibilityEvaluationUseCase(
          repository,
          dateProvider,
          uidGenerator,
          eventPublisher,
        ),
      inject: [
        SqlReconversionCompatibilityEvaluationRepository,
        RealDateProvider,
        RandomUuidGenerator,
        RealEventPublisher,
      ],
    },
    {
      provide: CompleteReconversionCompatibilityEvaluationUseCase,
      useFactory: (
        repository: ReconversionCompatibilityEvaluationRepository,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new CompleteReconversionCompatibilityEvaluationUseCase(
          repository,
          dateProvider,
          uidGenerator,
          eventPublisher,
        ),
      inject: [
        SqlReconversionCompatibilityEvaluationRepository,
        RealDateProvider,
        RandomUuidGenerator,
        RealEventPublisher,
      ],
    },
    SqlReconversionCompatibilityEvaluationRepository,
    RealDateProvider,
    RandomUuidGenerator,
    RealEventPublisher,
  ],
})
export class ReconversionCompatibilityModule {}
