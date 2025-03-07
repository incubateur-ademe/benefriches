import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { API_ROUTES, createSoilSurfaceAreaDistribution } from "shared";
import { z } from "zod";

import {
  CreateNewExpressSiteUseCase,
  ExpressSiteProps,
} from "src/sites/core/usecases/createNewExpressSite.usecase";
import { CreateNewCustomSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase, SiteNotFoundError } from "src/sites/core/usecases/getSiteById.usecase";

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
  ) {}

  @Post(API_ROUTES.SITES.CREATE_CUSTOM_SITE.path)
  async createNewCustomSite(
    @Body(new ZodValidationPipe(createCustomSiteDtoSchema)) createSiteDto: CreateCustomSiteDto,
  ) {
    const { createdBy, ...jsonSiteProps } = createSiteDto;
    const siteProps = {
      ...jsonSiteProps,
      soilsDistribution: createSoilSurfaceAreaDistribution(jsonSiteProps.soilsDistribution),
    };
    await this.createNewSiteUseCase.execute({ siteProps, createdBy });
  }

  @Post(API_ROUTES.SITES.CREATE_EXPRESS_SITE.path)
  async createNewExpressSite(
    @Body(new ZodValidationPipe(createExpressSiteDtoSchema)) createSiteDto: CreateExpressSiteDto,
  ) {
    const { createdBy, ...siteProps } = createSiteDto;
    await this.createNewExpressSiteUseCase.execute({
      siteProps: siteProps as ExpressSiteProps,
      createdBy,
    });
  }

  @Get("sites/:siteId")
  async getSiteById(@Param("siteId") siteId: string) {
    try {
      const site = await this.getSiteByIdUseCase.execute({ siteId });

      return site;
    } catch (err) {
      if (err instanceof SiteNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
