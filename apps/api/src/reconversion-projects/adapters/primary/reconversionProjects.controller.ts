import { Body, Controller, Get, Post } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";
import { photovoltaicPowerStationFeaturesSchema } from "src/reconversion-projects/domain/model/reconversionProject";
import {
  CreateReconversionProjectUseCase,
  reconversionProjectPropsSchema,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import { GetReconversionProjectsBySiteUseCase } from "src/reconversion-projects/domain/usecases/getReconversionProjectsBySite.usecase";

const jsonScheduleSchema = z.object({
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z.string().pipe(z.coerce.date()),
});

const reconversionProjectBodySchema = reconversionProjectPropsSchema.extend({
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
export type CreateReconversionProjectBodyDto = z.infer<typeof reconversionProjectBodySchema>;

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetReconversionProjectsBySiteUseCase,
  ) {}

  @Post()
  async createReconversionProject(
    @Body(new ZodValidationPipe(reconversionProjectBodySchema))
    createReconversionProjectDto: CreateReconversionProjectBodyDto,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: createReconversionProjectDto,
    });
  }

  @Get("list-by-site")
  async getListGroupedBySite() {
    const result = await this.getReconversionProjectsBySite.execute();
    return result;
  }
}
