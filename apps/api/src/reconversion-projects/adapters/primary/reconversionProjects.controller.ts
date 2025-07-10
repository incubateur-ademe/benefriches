import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { API_ROUTES } from "shared";
import { z } from "zod";

import { reconversionProjectPropsSchema } from "src/reconversion-projects/core/model/reconversionProject";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { CreateExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createExpressReconversionProject.usecase";
import { CreateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { QuickComputeUrbanProjectImpactsOnFricheUseCase } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

export const createReconversionProjectInputSchema = reconversionProjectPropsSchema;

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
      "PHOTOVOLTAIC_POWER_PLANT",
    ]),
  }),
) {}

class GetListGroupedBySiteQueryDto extends createZodDto(
  z.object({
    userId: z.string().uuid(),
  }),
) {}

class GetReconversionProjectImpactsQueryDto extends createZodDto(
  z.object({ evaluationPeriodInYears: z.coerce.number().nonnegative().optional() }),
) {}

class UrbanSprawlComparisonQueryDto extends createZodDto(
  API_ROUTES.URBAN_SPRAWL_IMPACTS_COMPARISON.GET.querySchema,
) {}

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase,
    private readonly getReconversionProjectImpactsUseCase: ComputeReconversionProjectImpactsUseCase,
    private readonly createExpressReconversionProjectUseCase: CreateExpressReconversionProjectUseCase,
    private readonly getReconversionProjectFeaturesUseCase: GetReconversionProjectFeaturesUseCase,
    private readonly quickComputeUrbanProjectImpactsOnFricheUseCase: QuickComputeUrbanProjectImpactsOnFricheUseCase,
    private readonly getProjectUrbanSprawlImpactsComparisonUseCase: ComputeProjectUrbanSprawlImpactsComparisonUseCase,
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

  @Get("quick-compute-urban-project-impacts-on-friche")
  async quickComputeUrbanProjectImpactsOnFriche(
    @Query("siteCityCode") siteCityCode: string,
    @Query("siteSurfaceArea") siteSurfaceArea: string,
  ) {
    const result = await this.quickComputeUrbanProjectImpactsOnFricheUseCase.execute({
      siteCityCode,
      siteSurfaceArea: Number(siteSurfaceArea),
    });
    return result;
  }

  @Get(API_ROUTES.URBAN_SPRAWL_IMPACTS_COMPARISON.GET.path.replace("/reconversion-projects/", ""))
  async getUrbanSprawlImpactsComparison(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Query() urbanSprawlComparisonQueryDto: UrbanSprawlComparisonQueryDto,
  ) {
    const result = await this.getProjectUrbanSprawlImpactsComparisonUseCase.execute({
      reconversionProjectId,
      evaluationPeriodInYears: urbanSprawlComparisonQueryDto.evaluationPeriodInYears,
      comparisonSiteNature: urbanSprawlComparisonQueryDto.comparisonSiteNature,
    });
    return result;
  }
}
