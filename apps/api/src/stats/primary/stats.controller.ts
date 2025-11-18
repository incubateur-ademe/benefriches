import { Controller, Get } from "@nestjs/common";

import { ComputeReconversionProjectImpactsStatsUseCase } from "../core/usecases/computeStatsFromImpacts.usecase";

@Controller("stats")
export class StatsController {
  constructor(
    private readonly computeReconversionProjectImpactsStatsUseCase: ComputeReconversionProjectImpactsStatsUseCase,
  ) {}

  @Get()
  async getStats() {
    return await this.computeReconversionProjectImpactsStatsUseCase.execute({
      evaluationPeriodInYears: 50,
    });
  }
}
