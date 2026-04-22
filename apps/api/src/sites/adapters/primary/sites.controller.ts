import {
  BadRequestException,
  Body,
  Controller,
  ConflictException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
  ParseFloatPipe,
  InternalServerErrorException,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ZodValidationPipe } from "nestjs-zod";
import {
  createCustomSiteDtoSchema,
  type CreateCustomSiteDto,
  createExpressSiteDtoSchema,
  type CreateExpressSiteDto,
  type GetSiteFeaturesResponseDto,
  type GetSiteRealEstateValuationResponseDto,
  type GetSiteViewResponseDto,
  type GetFricheInactionCostDto,
} from "shared";

import { JwtAuthGuard, RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
import { ArchiveSiteUseCase } from "src/sites/core/usecases/archiveSite.usecase";
import { ComputeFricheInactionCostUseCase } from "src/sites/core/usecases/computeFricheInactionCost.usecase";
import {
  CreateNewExpressSiteUseCase,
  ExpressSiteProps,
} from "src/sites/core/usecases/createNewExpressSite.usecase";
import { CreateNewCustomSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { GetSiteRealEstateValuationUseCase } from "src/sites/core/usecases/getSiteRealEstateValuation.usecase";
import { GetSiteViewByIdUseCase } from "src/sites/core/usecases/getSiteViewById.usecase";

@Controller()
export class SitesController {
  constructor(
    private readonly createNewSiteUseCase: CreateNewCustomSiteUseCase,
    private readonly createNewExpressSiteUseCase: CreateNewExpressSiteUseCase,
    private readonly getSiteByIdUseCase: GetSiteByIdUseCase,
    private readonly getSiteViewByIdUseCase: GetSiteViewByIdUseCase,
    private readonly getSiteRealEstateValuationUseCase: GetSiteRealEstateValuationUseCase,
    private readonly archiveSiteUseCase: ArchiveSiteUseCase,
    private readonly computeFricheInactionCostUseCase: ComputeFricheInactionCostUseCase,
  ) {}

  @Post("/sites/create-custom")
  async createNewCustomSite(
    @Body(new ZodValidationPipe(createCustomSiteDtoSchema)) createSiteDto: CreateCustomSiteDto,
  ) {
    const { createdBy, ...siteProps } = createSiteDto;
    const result = await this.createNewSiteUseCase.execute({ siteProps, createdBy });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "ValidationError":
          throw new BadRequestException({
            error: "VALIDATION_ERROR",
            message: "Invalid site data provided",
          });
        case "SiteAlreadyExists":
          throw new ConflictException({
            error: "SITE_ALREADY_EXISTS",
            message: "A site with this ID already exists",
          });
      }
    }
  }

  @Post("/sites/create-express")
  async createNewExpressSite(
    @Body(new ZodValidationPipe(createExpressSiteDtoSchema)) createSiteDto: CreateExpressSiteDto,
  ) {
    const { createdBy, ...siteProps } = createSiteDto;
    const result = await this.createNewExpressSiteUseCase.execute({
      siteProps: siteProps as ExpressSiteProps,
      createdBy,
    });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteAlreadyExists":
          throw new ConflictException({
            error: "SITE_ALREADY_EXISTS",
            message: "A site with this ID already exists",
          });
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("sites/:siteId/features")
  async getSiteById(@Param("siteId") siteId: string): Promise<GetSiteFeaturesResponseDto> {
    const result = await this.getSiteByIdUseCase.execute({ siteId });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteNotFound":
          throw new NotFoundException({
            error: "SITE_NOT_FOUND",
            message: `Site with ID ${siteId} not found`,
          });
      }
    }

    return result.getData().site;
  }

  @UseGuards(JwtAuthGuard)
  @Get("sites/:siteId")
  async getSiteViewById(@Param("siteId") siteId: string): Promise<GetSiteViewResponseDto> {
    const result = await this.getSiteViewByIdUseCase.execute({ siteId });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteNotFound":
          throw new NotFoundException({
            error: "SITE_NOT_FOUND",
            message: `Site with ID ${siteId} not found`,
          });
      }
    }

    return result.getData().site;
  }

  @UseGuards(JwtAuthGuard)
  @Get("sites/:siteId/real-estate-valuation")
  async getSiteRealEstateValuation(
    @Param("siteId") siteId: string,
  ): Promise<GetSiteRealEstateValuationResponseDto> {
    const result = await this.getSiteRealEstateValuationUseCase.execute({ siteId });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "SiteNotFound":
          throw new NotFoundException({
            error: "SITE_NOT_FOUND",
            message: `Site with ID ${siteId} not found`,
          });
      }
    }

    return result.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Post("sites/:siteId/archive")
  async archiveReconversionProject(
    @Param("siteId") siteId: string,
    @Req() req: RequestWithAuthenticatedUser,
  ) {
    const authenticatedUserId = req.accessTokenPayload.userId;

    const result = await this.archiveSiteUseCase.execute({
      siteId: siteId,
      userId: authenticatedUserId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "SiteNotFound":
          throw new NotFoundException(`Site with id ${siteId} not found`);
        case "UserNotAuthorized":
          throw new ForbiddenException();
      }
    }
  }

  @Get("friches/cout-inaction")
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  async computeFricheInactionCost(
    @Query("code_insee") codeInsee: string,
    @Query("superficie_m2", ParseFloatPipe) surfaceMetresCarres: number,
  ): Promise<GetFricheInactionCostDto> {
    if (!codeInsee || !/^\d{5}$/.test(codeInsee)) {
      throw new BadRequestException("code_insee invalide (format attendu : 5 chiffres)");
    }

    if (!surfaceMetresCarres || surfaceMetresCarres <= 0) {
      throw new BadRequestException("superficie_m2 doit être un nombre positif");
    }

    const result = await this.computeFricheInactionCostUseCase.execute({
      siteCityCode: codeInsee,
      siteSurfaceArea: surfaceMetresCarres,
    });

    if (!result.isSuccess()) {
      throw new InternalServerErrorException("Erreur lors du calcul du coût d'inaction");
    }

    const { security, illegalDumpingCost, siteCityData } = result.getData();

    const description =
      siteCityData.accuracy === "city"
        ? "Bénéfriches a calculé le coût de l'inaction à partir de données moyennes, de la superficie et des données communales de votre friche"
        : "Bénéfriches a calculé le coût de l'inaction à partir de données moyennes françaises et de la superficie de votre friche";

    return {
      cout_annuel_securisation: security,
      cout_annuel_debarras_depot_illegal: illegalDumpingCost,
      description,
      commune_data:
        siteCityData.accuracy === "city"
          ? {
              population: siteCityData.population,
              superficie: siteCityData.surfaceAreaSquareMeters,
              nom: siteCityData.name,
            }
          : undefined,
    };
  }
}
