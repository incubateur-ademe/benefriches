import z from "zod";
import { FricheActivity } from "../domain/friche.types";
import { SoilType } from "../domain/siteFoncier.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

const createSiteSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isFriche: z.boolean(),
  address: z.object({
    id: z.string(),
    value: z.string(),
    city: z.string(),
    cityCode: z.string(),
    postCode: z.string(),
    streetNumber: z.string().optional(),
    streetName: z.string().optional(),
    long: z.number(),
    lat: z.number(),
  }),
  surfaceArea: z.number().nonnegative(),
  soilsSurfaceAreas: z.record(z.nativeEnum(SoilType), z.number().nonnegative()),
  // contamination
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  fricheActivity: z.nativeEnum(FricheActivity).optional(),
  // management
  fullTimeJobsInvolved: z.number().nonnegative().optional(),
  owner: z.object({
    structureType: z.string(),
    name: z.string().optional(),
  }),
  tenant: z
    .object({
      structureType: z.string(),
      name: z.string().optional(),
    })
    .optional(),
  hasRecentAccidents: z.boolean().optional(),
  minorInjuriesPersons: z.number().nonnegative().optional(),
  severeInjuriesPersons: z.number().nonnegative().optional(),
  deaths: z.number().nonnegative().optional(),
  yearlyExpenses: z
    .object({
      type: z.string(),
      bearer: z.string(),
      category: z.string(),
      amount: z.number().nonnegative(),
    })
    .array(),
  yearlyIncome: z.number().nonnegative().optional(),
});

type SiteCreatePayload = z.infer<typeof createSiteSchema>;

export type CreateSiteGatewayPayload = SiteCreatePayload;

export interface CreateSiteGateway {
  save(siteData: CreateSiteGatewayPayload): Promise<void>;
}

export const saveSiteAction = createAppAsyncThunk<void>(
  "site/create",
  async (_, { getState, extra }) => {
    const { siteCreation } = getState();

    const siteToCreate = createSiteSchema.parse(siteCreation.siteData);

    await extra.createSiteService.save(siteToCreate);
  },
);
