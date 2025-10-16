import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import {
  API_ROUTES,
  expressProjectCategorySchema,
  saveReconversionProjectPropsSchema,
} from "shared";
import { z } from "zod";

import { JwtAuthGuard, RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
import { formatReconversionProjectInputToFeatures } from "src/reconversion-projects/core/model/formatProjectInputToFeatures";
import { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { CreateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { DuplicateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/duplicateReconversionProject.usecase";
import { GenerateAndSaveExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/generateAndSaveExpressReconversionProject.usecase";
import { GenerateExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/generateExpressReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { QuickComputeUrbanProjectImpactsOnFricheUseCase } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

class CreateReconversionProjectBodyDto extends createZodDto(saveReconversionProjectPropsSchema) {}

class GenerateExpressReconversionProjectQueryDto extends createZodDto(
  z.object({
    siteId: z.string(),
    createdBy: z.string(),
    category: expressProjectCategorySchema,
  }),
) {}

class GenerateAndSaveExpressReconversionProjectBodyDto extends createZodDto(
  z.object({
    reconversionProjectId: z.string(),
    siteId: z.string(),
    createdBy: z.string(),
    category: expressProjectCategorySchema,
  }),
) {}

class GetListGroupedBySiteQueryDto extends createZodDto(
  z.object({
    userId: z.uuid(),
  }),
) {}

class GetReconversionProjectImpactsQueryDto extends createZodDto(
  z.object({ evaluationPeriodInYears: z.coerce.number().nonnegative().optional() }),
) {}

class UrbanSprawlComparisonQueryDto extends createZodDto(
  API_ROUTES.URBAN_SPRAWL_IMPACTS_COMPARISON.GET.querySchema,
) {}

class DuplicateReconversionProjectBodyDto extends createZodDto(
  z.object({
    newProjectId: z.uuid(),
  }),
) {}

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase,
    private readonly getReconversionProjectImpactsUseCase: ComputeReconversionProjectImpactsUseCase,
    private readonly generateExpressReconversionProjectUseCase: GenerateExpressReconversionProjectUseCase,
    private readonly generateAndSaveExpressReconversionProjectUseCase: GenerateAndSaveExpressReconversionProjectUseCase,
    private readonly getReconversionProjectFeaturesUseCase: GetReconversionProjectFeaturesUseCase,
    private readonly quickComputeUrbanProjectImpactsOnFricheUseCase: QuickComputeUrbanProjectImpactsOnFricheUseCase,
    private readonly getProjectUrbanSprawlImpactsComparisonUseCase: ComputeProjectUrbanSprawlImpactsComparisonUseCase,
    private readonly duplicateReconversionProjectUseCase: DuplicateReconversionProjectUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReconversionProject(
    @Body() createReconversionProjectDto: CreateReconversionProjectBodyDto,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: createReconversionProjectDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get("create-from-site")
  async getExpressReconversionProject(
    @Query() getExpressReconversionProjectDto: GenerateExpressReconversionProjectQueryDto,
  ): Promise<ReconversionProjectFeaturesView> {
    const reconversionProject = await this.generateExpressReconversionProjectUseCase.execute(
      getExpressReconversionProjectDto,
    );
    return formatReconversionProjectInputToFeatures(reconversionProject);
  }

  @UseGuards(JwtAuthGuard)
  @Post("create-from-site")
  async createExpressReconversionProject(
    @Body() createReconversionProjectDto: GenerateAndSaveExpressReconversionProjectBodyDto,
  ) {
    await this.generateAndSaveExpressReconversionProjectUseCase.execute(
      createReconversionProjectDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(":reconversionProjectId/duplicate")
  async duplicateReconversionProject(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Body() body: DuplicateReconversionProjectBodyDto,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.duplicateReconversionProjectUseCase.execute({
      sourceProjectId: reconversionProjectId,
      newProjectId: body.newProjectId,
      userId: authenticatedUserId,
    });

    if (!result.success) {
      switch (result.error) {
        case "SOURCE_RECONVERSION_PROJECT_NOT_FOUND":
        case "USER_NOT_AUTHORIZED":
          throw new NotFoundException(
            `Reconversion project with id ${reconversionProjectId} not found`,
          );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("list-by-site")
  async getListGroupedBySite(@Query() { userId }: GetListGroupedBySiteQueryDto) {
    const result = await this.getReconversionProjectsBySite.execute({ userId });
    return result;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
