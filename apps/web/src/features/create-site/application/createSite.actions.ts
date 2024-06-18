import { fricheActivitySchema, soilTypeSchema } from "shared";
import z from "zod";
import { revertStep } from "./createSite.reducer";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export const revertAddressStep = () => revertStep({ resetFields: ["address"] });
export const revertSurfaceAreaStep = () => revertStep({ resetFields: ["surfaceArea"] });
export const revertSoilsSelectionStep = () => revertStep({ resetFields: ["soils"] });
export const revertSoilsSurfaceAreaDistributionEntryModeStep = () =>
  revertStep({
    resetFields: ["soilsDistributionEntryMode", "soilsDistribution"],
  });
export const revertSoilsDistributionStep = () => revertStep({ resetFields: ["soilsDistribution"] });
export const revertSoilsContaminationStep = () =>
  revertStep({
    resetFields: ["hasContaminatedSoils", "contaminatedSoilSurface"],
  });
export const revertOwnerStep = () => revertStep({ resetFields: ["owner"] });
export const revertIsFricheLeasedStep = () => revertStep({ resetFields: ["isFricheLeased"] });
export const revertIsSiteOperatedStep = () => revertStep({ resetFields: ["isSiteOperated"] });
export const revertTenantStep = () => revertStep({ resetFields: ["tenant"] });
export const revertOperatorStep = () => revertStep({ resetFields: ["tenant"] });
export const revertFullTimeJobsInvolvedStep = () =>
  revertStep({ resetFields: ["fullTimeJobsInvolved"] });
export const revertFricheRecentAccidentsStep = () =>
  revertStep({
    resetFields: [
      "hasRecentAccidents",
      "accidentsMinorInjuries",
      "accidentsSevereInjuries",
      "accidentsDeaths",
    ],
  });
export const revertYearlyExpensesStep = () => revertStep({ resetFields: ["yearlyExpenses"] });
export const revertYearlyIncomeStep = () => revertStep({ resetFields: ["yearlyIncomes"] });
export const revertFricheActivityStep = () => revertStep({ resetFields: ["fricheActivity"] });
export const revertNamingStep = () => revertStep({ resetFields: ["name", "description"] });

const createSiteSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
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
  accidentsMinorInjuries: z.number().nonnegative().optional(),
  accidentsSevereInjuries: z.number().nonnegative().optional(),
  accidentsDeaths: z.number().nonnegative().optional(),
  yearlyExpenses: z
    .object({
      purpose: z.string(),
      bearer: z.string(),
      purposeCategory: z.string(),
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

export const saveSiteAction = createAppAsyncThunk("site/create", async (_, { getState, extra }) => {
  const { siteCreation, currentUser } = getState();

  const siteToCreate = createSiteSchema.parse({
    ...siteCreation.siteData,
    createdBy: currentUser.currentUser?.id,
  });

  await extra.createSiteService.save(siteToCreate);
});
