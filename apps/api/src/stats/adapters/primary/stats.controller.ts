import { Controller, BadRequestException, Post, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import type { ComputeEvaluatedProjectStatsUseCase } from "src/stats/core/usecases/computeEvaluatedProjectStats.usecase";

class getEvaluatedProjectStatsDto extends createZodDto(
  z.object({
    reconversionProjectIds: z.array(z.string()),
  }),
) {}

@Controller("stats")
export class StatsController {
  constructor(
    private readonly computeEvaluatedProjectStatsUseCase: ComputeEvaluatedProjectStatsUseCase,
  ) {}

  @Post("average-impacts/search")
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: "Statistiques impacts" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reconversionProjectIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
          example: ["4db37f9b-ff75-41b4-9798-c17f5a5dd5ed"],
        },
      },
      required: ["reconversionProjectIds"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Délai moyen où les impacts compensent le déficit et coût de l'inaction révélé",
  })
  @ApiResponse({ status: 400, description: "Paramètres invalides" })
  async getEvaluatedProjectStatsUseCase(
    @Body() getReconversionProjectFromTemplateDto: getEvaluatedProjectStatsDto,
  ): Promise<{
    averageBreakEvenIndex: number;
    projectWithBreakEvenIndex: number;
    projectWithoutBreakEvenIndex: number;
    totalProjects: number;
    totalFricheProject: number;
    totalInactionCosts: number;
  }> {
    const result = await this.computeEvaluatedProjectStatsUseCase.execute(
      getReconversionProjectFromTemplateDto,
    );

    if (result.isFailure()) {
      switch (result.getError()) {
        case "NoProjectIdsProvided":
          throw new BadRequestException(result.getError());
      }
    }

    return result.getData();
  }
}
