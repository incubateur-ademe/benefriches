import {
  Controller,
  BadRequestException,
  Post,
  Body,
  Get,
  Query,
  InternalServerErrorException,
  Put,
  Patch,
  Delete,
  MethodNotAllowedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { createZodDto, ZodValidationPipe } from "nestjs-zod";
import {
  type GetPeriodicityStatsRequestDto,
  getPeriodicityStatsRequestDtoSchema,
  type GetPeriodicityStatsResponseDto,
} from "shared";
import { z } from "zod";

import { ComputeEvaluatedProjectStatsUseCase } from "src/stats/core/usecases/computeEvaluatedProjectStats.usecase";
import { ComputeStatsWithPeriodicityUseCase } from "src/stats/core/usecases/computeStatsWithPeriodicity.usecase";

class getEvaluatedProjectStatsDto extends createZodDto(
  z.object({
    reconversionProjectIds: z.array(z.string()),
  }),
) {}

@Controller("stats")
export class StatsController {
  private readonly computeEvaluatedProjectStatsUseCase: ComputeEvaluatedProjectStatsUseCase;
  private readonly computeStatsWithPeriodicityUseCase: ComputeStatsWithPeriodicityUseCase;

  constructor(
    computeEvaluatedProjectStatsUseCase: ComputeEvaluatedProjectStatsUseCase,
    computeStatsWithPeriodicityUseCase: ComputeStatsWithPeriodicityUseCase,
  ) {
    this.computeEvaluatedProjectStatsUseCase = computeEvaluatedProjectStatsUseCase;
    this.computeStatsWithPeriodicityUseCase = computeStatsWithPeriodicityUseCase;
  }

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

  @Get("")
  @ApiOperation({ summary: "Statistiques publiques" })
  @ApiQuery({ name: "periodicity", enum: ["day", "week", "month", "year"], required: false })
  @ApiQuery({ name: "since", type: "number", required: false })
  @ApiResponse({ status: 200, description: "Statistiques agrégées par période" })
  @ApiResponse({ status: 400, description: "Paramètres invalides" })
  async getStatsByPeriodicity(
    @Query(new ZodValidationPipe(getPeriodicityStatsRequestDtoSchema))
    query: GetPeriodicityStatsRequestDto,
  ): Promise<GetPeriodicityStatsResponseDto> {
    const result = await this.computeStatsWithPeriodicityUseCase.execute(query);

    if (result.isFailure()) {
      throw new InternalServerErrorException({ message: "Unexpected Internal Error" });
    }

    return result.getData();
  }

  @Post("")
  blockPost(): never {
    throw new MethodNotAllowedException();
  }

  @Put("")
  blockPut(): never {
    throw new MethodNotAllowedException();
  }

  @Patch("")
  blockPatch(): never {
    throw new MethodNotAllowedException();
  }

  @Delete("")
  blockDelete(): never {
    throw new MethodNotAllowedException();
  }
}
