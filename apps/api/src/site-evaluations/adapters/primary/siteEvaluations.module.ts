import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "src/auth/adapters/auth.module";
import { MutabilityEvaluationQuery } from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";
import { SiteEvaluationQuery } from "src/site-evaluations/core/gateways/SiteEvaluationQuery";
import { GetUserSiteEvaluationsUseCase } from "src/site-evaluations/core/usecases/getUserSiteEvaluations.usecase";

import { MutafrichesEvaluationQuery } from "../secondary/queries/MutafrichesEvaluationQuery";
import { SqlSiteEvaluationQuery } from "../secondary/queries/SqlSiteEvaluationQuery";
import { SiteEvaluationController } from "./siteEvaluations.controller";

@Module({
  imports: [ConfigModule, HttpModule, AuthModule],
  controllers: [SiteEvaluationController],
  providers: [
    {
      provide: GetUserSiteEvaluationsUseCase,
      useFactory: (
        siteEvaluationQuery: SiteEvaluationQuery,
        mutafrichesEvaluationQuery: MutabilityEvaluationQuery,
      ) => new GetUserSiteEvaluationsUseCase(siteEvaluationQuery, mutafrichesEvaluationQuery),
      inject: [SqlSiteEvaluationQuery, MutafrichesEvaluationQuery],
    },
    SqlSiteEvaluationQuery,
    MutafrichesEvaluationQuery,
  ],
})
export class SiteEvaluationsModule {}
