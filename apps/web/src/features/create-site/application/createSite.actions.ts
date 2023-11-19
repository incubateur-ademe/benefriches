import { v4 as uuid } from "uuid";
import z from "zod";
import { FricheActivity } from "../domain/friche.types";
import { OwnerType, SoilType } from "../domain/siteFoncier.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

const createSiteSchema = z.object({
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
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  fricheActivity: z.nativeEnum(FricheActivity).optional(),
  // management
  fullTimeJobsInvolved: z.number().nonnegative(),
  owner: z.object({
    type: z.nativeEnum(OwnerType),
    name: z.string().optional(),
  }),
  tenantBusinessName: z.string().optional(),
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

export type CreateSiteGatewayPayload = SiteCreatePayload & { id: string };
export type CreateSiteGatewayResult = void;

export interface CreateSiteGateway {
  save(siteData: CreateSiteGatewayPayload): Promise<CreateSiteGatewayResult>;
}

export const saveSiteAction = createAppAsyncThunk<CreateSiteGatewayResult>(
  "site/create",
  async (_, { getState, extra }) => {
    const { siteCreation } = getState();

    const siteToCreate = createSiteSchema.parse(siteCreation.siteData);

    await extra.createSiteService.save({ id: uuid(), ...siteToCreate });
  },
);
