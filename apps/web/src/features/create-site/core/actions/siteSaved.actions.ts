import { fricheActivitySchema, siteNatureSchema, soilTypeSchema } from "shared";
import z from "zod";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import getExpressSiteData from "../siteExpress";
import { SiteExpressCreationData } from "../siteFoncier.types";

const createSiteSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  creationMode: z.enum(["express", "custom"]),
  name: z.string(),
  description: z.string().optional(),
  isFriche: z.boolean(),
  nature: siteNatureSchema,
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
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  fricheActivity: fricheActivitySchema.optional(),
  // management
  owner: z.object({
    structureType: z.string(),
    name: z.string(),
  }),
  tenant: z
    .object({
      structureType: z.string(),
      name: z.string(),
    })
    .optional(),
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

    const siteToCreate: SiteCreatePayload = createSiteSchema.parse({
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
      getExpressSiteData(siteData as SiteExpressCreationData, currentUser.currentUser.id),
    );

    await extra.createSiteService.save(siteToCreate);

    return siteToCreate;
  },
);
