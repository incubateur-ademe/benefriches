import {
  Body,
  Controller,
  Get,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  reconversionProjectTemplateSchema,
  httpUpdateReconversionProjectPropsSchema,
  getUrbanSprawlImpactsComparisonDtoSchema,
  createReconversionProjectRequestDtoSchema,
  type CreateReconversionProjectRequestDto,
  type GetReconversionProjectFeaturesResponseDto,
} from "shared";
// oxlint-disable-next-line api-conventions/no-local-dto-schema -- legacy local schemas, to move to packages/shared/src/api-dtos
import { z } from "zod";

import { JwtAuthGuard, type RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
import { formatReconversionProjectInputToFeatures } from "src/reconversion-projects/core/model/formatProjectInputToFeatures";
import type { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import { ArchiveReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/archiveReconversionProject.usecase";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase";
import { ComputeReconversionProjectBreakEvenLevelUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectBreakEvenLevel.usecase";
import { CreateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { DuplicateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/duplicateReconversionProject.usecase";
import { GenerateAndSaveReconversionProjectFromTemplateUseCase } from "src/reconversion-projects/core/usecases/generateAndSaveReconversionProjectFromTemplate.usecase";
import { GenerateReconversionProjectFromTemplateUseCase } from "src/reconversion-projects/core/usecases/generateReconversionProjectFromTemplate.usecase";
import { GetReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/getReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { GetUserReconversionProjectsBySiteUseCase } from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { QuickComputeUrbanProjectImpactsOnFricheUseCase } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";
import { UpdateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/updateReconversionProject.usecase";

type UpdateReconversionProjectBody = z.infer<typeof httpUpdateReconversionProjectPropsSchema>;

const generateReconversionProjectFromTemplateQuerySchema = z.object({
  siteId: z.string(),
  template: reconversionProjectTemplateSchema,
});
type GenerateReconversionProjectFromTemplateQuery = z.infer<
  typeof generateReconversionProjectFromTemplateQuerySchema
>;

const generateAndSaveReconversionProjectFromTemplateBodySchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  template: reconversionProjectTemplateSchema,
});
type GenerateAndSaveReconversionProjectFromTemplateBody = z.infer<
  typeof generateAndSaveReconversionProjectFromTemplateBodySchema
>;

const getListGroupedBySiteQuerySchema = z.object({
  userId: z.uuid(),
});
type GetListGroupedBySiteQuery = z.infer<typeof getListGroupedBySiteQuerySchema>;

type UrbanSprawlComparisonQuery = z.infer<typeof getUrbanSprawlImpactsComparisonDtoSchema>;

const duplicateReconversionProjectBodySchema = z.object({
  newProjectId: z.uuid(),
});
type DuplicateReconversionProjectBody = z.infer<typeof duplicateReconversionProjectBodySchema>;

@Controller("reconversion-projects")
export class ReconversionProjectController {
  private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase;
  private readonly updateReconversionProjectUseCase: UpdateReconversionProjectUseCase;
  private readonly getReconversionProjectUseCase: GetReconversionProjectUseCase;
  private readonly getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase;
  private readonly getReconversionProjectImpactsBreakEvenLevelUseCase: ComputeReconversionProjectBreakEvenLevelUseCase;
  private readonly generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase;
  private readonly generateAndSaveReconversionProjectFromTemplateUseCase: GenerateAndSaveReconversionProjectFromTemplateUseCase;
  private readonly getReconversionProjectFeaturesUseCase: GetReconversionProjectFeaturesUseCase;
  private readonly quickComputeUrbanProjectImpactsOnFricheUseCase: QuickComputeUrbanProjectImpactsOnFricheUseCase;
  private readonly getProjectUrbanSprawlImpactsComparisonUseCase: ComputeProjectUrbanSprawlImpactsComparisonUseCase;
  private readonly duplicateReconversionProjectUseCase: DuplicateReconversionProjectUseCase;
  private readonly archiveReconversionProjectUseCase: ArchiveReconversionProjectUseCase;
  constructor(
    createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    updateReconversionProjectUseCase: UpdateReconversionProjectUseCase,
    getReconversionProjectUseCase: GetReconversionProjectUseCase,
    getReconversionProjectsBySite: GetUserReconversionProjectsBySiteUseCase,
    getReconversionProjectImpactsBreakEvenLevelUseCase: ComputeReconversionProjectBreakEvenLevelUseCase,
    generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase,
    generateAndSaveReconversionProjectFromTemplateUseCase: GenerateAndSaveReconversionProjectFromTemplateUseCase,
    getReconversionProjectFeaturesUseCase: GetReconversionProjectFeaturesUseCase,
    quickComputeUrbanProjectImpactsOnFricheUseCase: QuickComputeUrbanProjectImpactsOnFricheUseCase,
    getProjectUrbanSprawlImpactsComparisonUseCase: ComputeProjectUrbanSprawlImpactsComparisonUseCase,
    duplicateReconversionProjectUseCase: DuplicateReconversionProjectUseCase,
    archiveReconversionProjectUseCase: ArchiveReconversionProjectUseCase,
  ) {
    this.createReconversionProjectUseCase = createReconversionProjectUseCase;
    this.updateReconversionProjectUseCase = updateReconversionProjectUseCase;
    this.getReconversionProjectUseCase = getReconversionProjectUseCase;
    this.getReconversionProjectsBySite = getReconversionProjectsBySite;
    this.getReconversionProjectImpactsBreakEvenLevelUseCase =
      getReconversionProjectImpactsBreakEvenLevelUseCase;
    this.generateReconversionProjectFromTemplateUseCase =
      generateReconversionProjectFromTemplateUseCase;
    this.generateAndSaveReconversionProjectFromTemplateUseCase =
      generateAndSaveReconversionProjectFromTemplateUseCase;
    this.getReconversionProjectFeaturesUseCase = getReconversionProjectFeaturesUseCase;
    this.quickComputeUrbanProjectImpactsOnFricheUseCase =
      quickComputeUrbanProjectImpactsOnFricheUseCase;
    this.getProjectUrbanSprawlImpactsComparisonUseCase =
      getProjectUrbanSprawlImpactsComparisonUseCase;
    this.duplicateReconversionProjectUseCase = duplicateReconversionProjectUseCase;
    this.archiveReconversionProjectUseCase = archiveReconversionProjectUseCase;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReconversionProject(
    @Body({ schema: createReconversionProjectRequestDtoSchema })
    createReconversionProjectDto: CreateReconversionProjectRequestDto,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: {
        ...createReconversionProjectDto,
        createdBy: req.accessTokenPayload.userId,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(":reconversionProjectId")
  async updateReconversionProject(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Body({ schema: httpUpdateReconversionProjectPropsSchema }) body: UpdateReconversionProjectBody,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.updateReconversionProjectUseCase.execute({
      reconversionProjectProps: body,
      userId: authenticatedUserId,
      reconversionProjectId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "ReconversionProjectNotFound":
          throw new NotFoundException(
            `Reconversion project with id ${reconversionProjectId} not found`,
          );
        case "UserNotAuthorized":
          throw new ForbiddenException();
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("create-from-template")
  async getReconversionProjectFromTemplate(
    @Query({ schema: generateReconversionProjectFromTemplateQuerySchema })
    getReconversionProjectFromTemplateDto: GenerateReconversionProjectFromTemplateQuery,
    @Req() req: RequestWithAuthenticatedUser,
  ): Promise<ReconversionProjectFeaturesView> {
    const result = await this.generateReconversionProjectFromTemplateUseCase.execute({
      siteId: getReconversionProjectFromTemplateDto.siteId,
      template: getReconversionProjectFromTemplateDto.template,
      createdBy: req.accessTokenPayload.userId,
    });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteNotFound":
          throw new NotFoundException(result.getError());
      }
    }

    return formatReconversionProjectInputToFeatures(result.getData());
  }

  @UseGuards(JwtAuthGuard)
  @Post("create-from-template")
  async createReconversionProjectFromTemplate(
    @Body({ schema: generateAndSaveReconversionProjectFromTemplateBodySchema })
    createReconversionProjectDto: GenerateAndSaveReconversionProjectFromTemplateBody,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const result = await this.generateAndSaveReconversionProjectFromTemplateUseCase.execute({
      reconversionProjectId: createReconversionProjectDto.reconversionProjectId,
      siteId: createReconversionProjectDto.siteId,
      template: createReconversionProjectDto.template,
      createdBy: req.accessTokenPayload.userId,
    });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteNotFound":
          throw new NotFoundException(result.getError());
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":reconversionProjectId/duplicate")
  async duplicateReconversionProject(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Body({ schema: duplicateReconversionProjectBodySchema })
    body: DuplicateReconversionProjectBody,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.duplicateReconversionProjectUseCase.execute({
      sourceProjectId: reconversionProjectId,
      newProjectId: body.newProjectId,
      userId: authenticatedUserId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "SourceReconversionProjectNotFound":
          throw new NotFoundException(
            `Reconversion project with id ${reconversionProjectId} not found`,
          );
        case "UserNotAuthorized":
          throw new ForbiddenException();
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":reconversionProjectId/archive")
  async archiveReconversionProject(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.archiveReconversionProjectUseCase.execute({
      projectId: reconversionProjectId,
      userId: authenticatedUserId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "ReconversionProjectNotFound":
          throw new NotFoundException(
            `Reconversion project with id ${reconversionProjectId} not found`,
          );
        case "UserNotAuthorized":
          throw new ForbiddenException();
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("list-by-site")
  async getListGroupedBySite(
    @Query({ schema: getListGroupedBySiteQuerySchema }) { userId }: GetListGroupedBySiteQuery,
  ) {
    const result = await this.getReconversionProjectsBySite.execute({ userId });

    if (result.isFailure()) {
      throw new NotFoundException(result.getError());
    }

    return result.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":reconversionProjectId/impacts")
  async getProjectImpacts(@Param("reconversionProjectId") reconversionProjectId: string) {
    const result = await this.getReconversionProjectImpactsBreakEvenLevelUseCase.execute({
      reconversionProjectId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "ReconversionProjectNotFound":
        case "SiteNotFound":
        case "NoDevelopmentPlanType":
          throw new NotFoundException(error);
      }
    }
    return result.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":reconversionProjectId/features")
  async getReconversionProjectFeatures(
    @Param("reconversionProjectId") reconversionProjectId: string,
  ): Promise<GetReconversionProjectFeaturesResponseDto> {
    const result = await this.getReconversionProjectFeaturesUseCase.execute({
      reconversionProjectId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "ReconversionProjectNotFound":
          throw new NotFoundException(error);
        case "ReconversionProjectIdRequired":
          throw new BadRequestException(error);
      }
    }

    return result.getData() as GetReconversionProjectFeaturesResponseDto;
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

    if (result.isFailure()) {
      throw new NotFoundException("Failed to compute impacts");
    }

    return result.getData();
  }

  @Get(":reconversionProjectId/urban-sprawl-comparison")
  async getUrbanSprawlImpactsComparison(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Query({ schema: getUrbanSprawlImpactsComparisonDtoSchema })
    urbanSprawlComparisonQueryDto: UrbanSprawlComparisonQuery,
  ) {
    const result = await this.getProjectUrbanSprawlImpactsComparisonUseCase.execute({
      reconversionProjectId,
      evaluationPeriodInYears: urbanSprawlComparisonQueryDto.evaluationPeriodInYears,
      comparisonSiteNature: urbanSprawlComparisonQueryDto.comparisonSiteNature,
    });

    if (result.isFailure()) {
      const error = result.getError();
      if (error === "ReconversionProjectNotFound" || error === "SiteNotFound") {
        throw new NotFoundException(error);
      }
      throw new NotFoundException("NoDevelopmentPlanType");
    }

    return result.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":reconversionProjectId")
  async getReconversionProject(
    @Param("reconversionProjectId") reconversionProjectId: string,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.getReconversionProjectUseCase.execute({
      reconversionProjectId,
      authenticatedUserId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "ReconversionProjectNotFound":
          throw new NotFoundException(
            `Reconversion project with id ${reconversionProjectId} not found`,
          );
        case "SiteNotFound":
          throw new NotFoundException(`Related Site not found`);
        case "UserNotAuthorized":
          throw new ForbiddenException();
        case "ValidationError":
          throw new BadRequestException();
      }
    }
    return result.getData();
  }
}
