import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  costSchema,
  photovoltaicPowerStationFeaturesSchema,
} from "src/reconversion-projects/core/model/reconversionProject";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { CreateExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createExpressReconversionProject.usecase";
import {
  CreateReconversionProjectUseCase,
  reconversionProjectPropsSchema,
} from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";

const jsonScheduleSchema = z.object({
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z.string().pipe(z.coerce.date()),
});

export const createReconversionProjectInputSchema = reconversionProjectPropsSchema.extend({
  reinstatementSchedule: jsonScheduleSchema.optional(),
  developmentPlan: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
      costs: costSchema.array(),
      developer: z.object({ name: z.string(), structureType: z.string() }),
      features: photovoltaicPowerStationFeaturesSchema,
      installationSchedule: jsonScheduleSchema.optional(),
    }),
  ]),
});

class CreateReconversionProjectBodyDto extends createZodDto(createReconversionProjectInputSchema) {}

class CreateExpressReconversionProjectBodyDto extends createZodDto(
  z.object({
    reconversionProjectId: z.string(),
    siteId: z.string(),
    createdBy: z.string(),
    category: z.enum([
      "PUBLIC_FACILITIES",
      "RESIDENTIAL_TENSE_AREA",
      "RESIDENTIAL_NORMAL_AREA",
      "NEW_URBAN_CENTER",
    ]),
  }),
) {}

class GetListGroupedBySiteQueryDto extends createZodDto(
  z.object({
    userId: z.string().uuid(),
  }),
) {}

class GetReconversionProjectImpactsQueryDto extends createZodDto(
  z.object({ evaluationPeriodInYears: z.coerce.number().nonnegative() }),
) {}

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase,
    private readonly getReconversionProjectImpactsUseCase: ComputeReconversionProjectImpactsUseCase,
    private readonly createExpressReconversionProjectUseCase: CreateExpressReconversionProjectUseCase,
    private readonly getReconversionProjectFeaturesUseCase: GetReconversionProjectFeaturesUseCase,
  ) {}

  @Post()
  async createReconversionProject(
    @Body() createReconversionProjectDto: CreateReconversionProjectBodyDto,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: createReconversionProjectDto,
    });
  }

  @Post("create-from-site")
  async createExpressReconversionProject(
    @Body() createReconversionProjectDto: CreateExpressReconversionProjectBodyDto,
  ) {
    return await this.createExpressReconversionProjectUseCase.execute(createReconversionProjectDto);
  }

  @Get("list-by-site")
  async getListGroupedBySite(@Query() { userId }: GetListGroupedBySiteQueryDto) {
    const result = await this.getReconversionProjectsBySite.execute({ userId });
    return result;
  }

  @Get(":reconversionProjectId/impacts")
  async getProjectImpacts(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Query() { evaluationPeriodInYears }: GetReconversionProjectImpactsQueryDto,
  ) {
    const result = await this.getReconversionProjectImpactsUseCase.execute({
      reconversionProjectId,
      evaluationPeriodInYears,
    });

    return result;
  }

  @Get(":reconversionProjectId/features")
  async getReconversionProjectFeatures(
    @Param("reconversionProjectId") reconversionProjectId: string,
  ) {
    const result = await this.getReconversionProjectFeaturesUseCase.execute({
      reconversionProjectId,
    });

    return result;
  }
}
