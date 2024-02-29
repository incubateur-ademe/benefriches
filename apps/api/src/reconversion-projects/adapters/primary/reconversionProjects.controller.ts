import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { photovoltaicPowerStationFeaturesSchema } from "src/reconversion-projects/domain/model/reconversionProject";
import {
  CreateReconversionProjectUseCase,
  reconversionProjectPropsSchema,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "src/reconversion-projects/domain/usecases/getUserReconversionProjectsBySite.usecase";

const jsonScheduleSchema = z.object({
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z.string().pipe(z.coerce.date()),
});

export const createReconversionProjectInputSchema = reconversionProjectPropsSchema.extend({
  reinstatementSchedule: jsonScheduleSchema.optional(),
  developmentPlans: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
        cost: z.number().nonnegative(),
        features: photovoltaicPowerStationFeaturesSchema,
        installationSchedule: jsonScheduleSchema.optional(),
      }),
    ])
    .array()
    .nonempty(),
});

class CreateReconversionProjectInputDto extends createZodDto(
  createReconversionProjectInputSchema,
) {}

class GetListGroupedBySiteQueryDto extends createZodDto(
  z.object({
    userId: z.string().uuid(),
  }),
) {}

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase,
  ) {}

  @Post()
  async createReconversionProject(
    @Body() createReconversionProjectDto: CreateReconversionProjectInputDto,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: createReconversionProjectDto,
    });
  }

  @Get("list-by-site")
  async getListGroupedBySite(@Query() { userId }: GetListGroupedBySiteQueryDto) {
    const result = await this.getReconversionProjectsBySite.execute({ userId });
    return result;
  }
}
