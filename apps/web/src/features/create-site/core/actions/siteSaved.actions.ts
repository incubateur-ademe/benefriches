import { fricheActivitySchema, soilTypeSchema } from "shared";
import z from "zod";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import getExpressSiteData from "../siteExpress";
import { SiteExpressDraft } from "../siteFoncier.types";

const createSiteSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  creationMode: z.enum(["express", "custom"]),
  name: z.string(),
  description: z.string().optional(),
  isFriche: z.boolean(),
  address: z.object({
    banId: z.string(),
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
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  // contamination
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  fricheActivity: fricheActivitySchema.optional(),
  // management
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
  accidentsMinorInjuries: z.number().nonnegative().optional(),
  accidentsSevereInjuries: z.number().nonnegative().optional(),
  accidentsDeaths: z.number().nonnegative().optional(),
  yearlyExpenses: z
    .object({
      purpose: z.string(),
      bearer: z.string(),
      amount: z.number().nonnegative(),
    })
    .array(),
  yearlyIncomes: z
    .object({
      source: z.string(),
      amount: z.number().nonnegative(),
    })
    .array(),
});

type SiteCreatePayload = z.infer<typeof createSiteSchema>;

export type CreateSiteGatewayPayload = SiteCreatePayload;

export interface CreateSiteGateway {
  save(siteData: CreateSiteGatewayPayload): Promise<void>;
}

export const customSiteSaved = createAppAsyncThunk(
  "siteCreation/customSiteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();

    const siteToCreate = createSiteSchema.parse({
      ...siteCreation.siteData,
      creationMode: "custom",
      createdBy: currentUser.currentUser?.id,
    });

    await extra.createSiteService.save(siteToCreate);
  },
);

export const expressSiteSaved = createAppAsyncThunk(
  "siteCreation/expressSiteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const { siteData } = siteCreation;

    if (!currentUser.currentUser) {
      throw new Error("Current user is missing");
    }

    const siteToCreate = createSiteSchema.parse(
      getExpressSiteData(siteData as SiteExpressDraft, currentUser.currentUser.id),
    );

    await extra.createSiteService.save(siteToCreate);

    return siteToCreate;
  },
);
