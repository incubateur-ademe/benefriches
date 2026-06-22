import z from "zod";

import { siteStakeholdersStructureTypeSchema } from "../stakeholder";
import { siteYearlyExpenseSchema } from "../yearlyExpenses";
import { siteYearlyIncomeSchema } from "../yearlyIncome";

export const siteOperationEconomicBalanceItemSchema = z.object({
  total: z.number(),
  detailsByYear: z.array(z.number()),
  cumulativeByYear: z.array(z.number()),
  details: z.union([siteYearlyExpenseSchema.shape.purpose, siteYearlyIncomeSchema.shape.source]),
  name: z.literal("operatingEconomicBalance"),
});
export type OperatingEconomicBalanceItem = z.infer<typeof siteOperationEconomicBalanceItemSchema>;

export const siteStakeholdersImpactsSchema = z.object({
  structureType: z.union([
    siteStakeholdersStructureTypeSchema,
    z.literal("local_authority"),
    z.literal("company"),
    z.literal("unknown"),
  ]),
  structureName: z.string().optional(),
});

const socioEconomicMonetaryImpactNameSchema = z.enum([
  "storedCo2Eq",
  "natureRelatedWelnessAndLeisure",
  "forestRelatedProduct",
  "pollination",
  "invasiveSpeciesRegulation",
  "waterCycle",
  "nitrogenCycle",
  "soilErosion",
  "waterRegulation",
  "rentalIncome",
]);

const impactMetricNameSchema = z.enum([
  "storedCo2Eq",
  "permeableSurface",
  "contaminatedSurface",
  "operationsFullTimeJobs",
  "fricheAccidentsDeaths",
  "fricheAccidentsSevereInjuries",
  "fricheAccidentsMinorInjuries",
]);

const fricheCostsIndirectEconomicImpactsSchema = z.object({
  total: z.number(),
  detailsByYear: z.array(z.number()),
  cumulativeByYear: z.array(z.number()),
  details: z.enum([
    "security",
    "illegalDumpingCost",
    "accidentsCost",
    "otherSecuringCosts",
    "maintenance",
  ]),
  name: z.enum([
    "fricheMaintenanceAndSecuringCostsForOwner",
    "fricheMaintenanceAndSecuringCostsForTenant",
  ]),
});

const taxesIncomeImpactsSchema = z.object({
  total: z.number(),
  detailsByYear: z.array(z.number()),
  cumulativeByYear: z.array(z.number()),
  details: z.enum(["taxes", "operationsTaxesIncome", "propertyTaxesIncome"]),
  name: z.literal("taxesIncome"),
});

export const siteIndirectEconomicImpactSchema = z.discriminatedUnion("name", [
  z.object({
    total: z.number(),
    detailsByYear: z.array(z.number()),
    cumulativeByYear: z.array(z.number()),
    name: socioEconomicMonetaryImpactNameSchema,
  }),
  taxesIncomeImpactsSchema,
  fricheCostsIndirectEconomicImpactsSchema,
]);

export type TaxesIncomeIndirectEconomicImpacts = z.infer<typeof taxesIncomeImpactsSchema>;
export type FricheCostsIndirectEconomicImpacts = z.infer<
  typeof fricheCostsIndirectEconomicImpactsSchema
>;
export type SiteStatuQuoEconomicImpact =
  | z.infer<typeof siteIndirectEconomicImpactSchema>
  | OperatingEconomicBalanceItem;
export type SiteStatuQuoImpacts = z.infer<typeof siteStatuQuoImpactsSchema>;

export type SiteStatuQuoImpactMetric = z.infer<typeof siteStatuQuoImpactMetricSchema>;
export const siteStatuQuoImpactMetricSchema = z.object({
  total: z.number(),
  name: impactMetricNameSchema,
});
export const siteStatuQuoImpactsSchema = z.object({
  projectionYears: z.array(z.string()),
  economicImpacts: z.object({
    total: z.number(),
    details: z.array(
      z.union([siteIndirectEconomicImpactSchema, siteOperationEconomicBalanceItemSchema]),
    ),
  }),
  impactMetrics: z.array(siteStatuQuoImpactMetricSchema),
  stakeholders: z.object({
    operator: siteStakeholdersImpactsSchema.optional(),
    tenant: siteStakeholdersImpactsSchema.optional(),
    owner: siteStakeholdersImpactsSchema.optional(),
  }),
});
