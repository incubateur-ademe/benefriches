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
import { z } from "zod";
import {
  CreateNewSiteUseCase,
  sitePropsSchema,
} from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase, SiteNotFoundError } from "src/sites/core/usecases/getSiteById.usecase";

// here we can't use createZodDto because sitePropsSchema is a discriminated union: https://github.com/risen228/nestjs-zod/issues/41
export type CreateSiteBodyDto = z.infer<typeof sitePropsSchema>;

@Controller("sites")
export class SitesController {
  constructor(
    private readonly createNewSiteUseCase: CreateNewSiteUseCase,
    private readonly getSiteByIdUseCase: GetSiteByIdUseCase,
  ) {}

  @Post()
  async createNewSite(
    @Body(new ZodValidationPipe(sitePropsSchema)) createSiteDto: CreateSiteBodyDto,
  ) {
    await this.createNewSiteUseCase.execute({ siteProps: createSiteDto });
  }

  @Get(":siteId")
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
