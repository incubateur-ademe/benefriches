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
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { API_ROUTES, createSoilSurfaceAreaDistribution } from "shared";
import { z } from "zod";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import {
  CreateNewExpressSiteUseCase,
  ExpressSiteProps,
} from "src/sites/core/usecases/createNewExpressSite.usecase";
import { CreateNewCustomSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { GetSiteViewByIdUseCase } from "src/sites/core/usecases/getSiteViewById.usecase";

// here we can't use createZodDto because dto schema is a discriminated union: https://github.com/risen228/nestjs-zod/issues/41
const createCustomSiteDtoSchema = API_ROUTES.SITES.CREATE_CUSTOM_SITE.bodySchema;
export type CreateCustomSiteDto = z.infer<typeof createCustomSiteDtoSchema>;

// here we can't use createZodDto because dto schema is a discriminated union: https://github.com/risen228/nestjs-zod/issues/41
const createExpressSiteDtoSchema = API_ROUTES.SITES.CREATE_EXPRESS_SITE.bodySchema;
export type CreateExpressSiteDto = z.infer<typeof createExpressSiteDtoSchema>;

@Controller()
export class SitesController {
  constructor(
    private readonly createNewSiteUseCase: CreateNewCustomSiteUseCase,
    private readonly createNewExpressSiteUseCase: CreateNewExpressSiteUseCase,
    private readonly getSiteByIdUseCase: GetSiteByIdUseCase,
    private readonly getSiteViewByIdUseCase: GetSiteViewByIdUseCase,
  ) {}

  @Post(API_ROUTES.SITES.CREATE_CUSTOM_SITE.path)
  async createNewCustomSite(
    @Body(new ZodValidationPipe(createCustomSiteDtoSchema)) createSiteDto: CreateCustomSiteDto,
  ) {
    const { createdBy, ...jsonSiteProps } = createSiteDto;
    const siteProps = {
      ...jsonSiteProps,
      soilsDistribution: createSoilSurfaceAreaDistribution(jsonSiteProps.soilsDistribution),
    } as const;
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

  @Post(API_ROUTES.SITES.CREATE_EXPRESS_SITE.path)
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
  async getSiteById(@Param("siteId") siteId: string) {
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
  async getSiteViewById(@Param("siteId") siteId: string) {
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
}
