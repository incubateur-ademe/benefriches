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
import {
  createSoilSurfaceAreaDistribution,
  fricheActivitySchema,
  siteNatureSchema,
  siteYearlyExpenseSchema,
} from "shared";
import { z } from "zod";

import { addressSchema } from "src/sites/core/models/site";
import { CreateNewSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase, SiteNotFoundError } from "src/sites/core/usecases/getSiteById.usecase";

const commonSitePropsSchema = z.object({
  createdBy: z.string(),
  creationMode: z.union([z.literal("express"), z.literal("custom")]),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: addressSchema,
  soilsDistribution: z.record(z.string(), z.number().nonnegative()),
  owner: z.object({ structureType: z.string(), name: z.string() }).optional(),
  tenant: z.object({ structureType: z.string(), name: z.string() }).optional(),
  yearlyExpenses: siteYearlyExpenseSchema.array(),
  yearlyIncomes: z
    .object({
      source: z.string(),
      amount: z.number().nonnegative(),
    })
    .array(),
});
const fricheDtoSchema = commonSitePropsSchema.extend({
  isFriche: z.literal(true),
  nature: siteNatureSchema.extract(["FRICHE"]),
  fricheActivity: fricheActivitySchema.optional(),
  contaminatedSoilSurface: z.number().optional(),
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
});
const agriculturaOrNaturalSiteDtoSchema = commonSitePropsSchema.extend({
  isFriche: z.literal(false),
  nature: siteNatureSchema.exclude(["FRICHE"]),
});
const createSiteDtoSchema = z.discriminatedUnion("isFriche", [
  fricheDtoSchema,
  agriculturaOrNaturalSiteDtoSchema,
]);
// here we can't use createZodDto because dto schema is a discriminated union: https://github.com/risen228/nestjs-zod/issues/41
export type CreateSiteBodyDto = z.infer<typeof createSiteDtoSchema>;

@Controller("sites")
export class SitesController {
  constructor(
    private readonly createNewSiteUseCase: CreateNewSiteUseCase,
    private readonly getSiteByIdUseCase: GetSiteByIdUseCase,
  ) {}

  @Post()
  async createNewSite(
    @Body(new ZodValidationPipe(createSiteDtoSchema)) createSiteDto: CreateSiteBodyDto,
  ) {
    const { createdBy, creationMode, ...jsonSiteProps } = createSiteDto;
    const siteProps = {
      ...jsonSiteProps,
      soilsDistribution: createSoilSurfaceAreaDistribution(jsonSiteProps.soilsDistribution),
    };
    await this.createNewSiteUseCase.execute({ siteProps, createdBy, creationMode });
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
