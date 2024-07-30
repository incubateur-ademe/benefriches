import { z } from "zod";
import { soilTypeSchema } from "src/soils/domain/soils";

const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "HOSPITAL",
  "ADMINISTRATION",
  "BUSINESS",
  "HOUSING",
]);

export type FricheActivity = z.infer<typeof fricheActivitySchema>;

const expenseSchema = z.object({
  purpose: z.string(),
  bearer: z.string(),
  purposeCategory: z.string(),
  amount: z.number().nonnegative(),
});

const incomeSchema = z.object({
  source: z.string(),
  amount: z.number().nonnegative(),
});

const addressSchema = z.object({
  banId: z.string(),
  value: z.string(),
  city: z.string(),
  cityCode: z.string(),
  postCode: z.string(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  long: z.number(),
  lat: z.number(),
});

export type Address = z.infer<typeof addressSchema>;

export const nonFricheSiteSchema = z.object({
  isFriche: z.literal(false),
  id: z.string().uuid(),
  name: z.string(),
  createdBy: z.string().uuid(),
  creationMode: z.enum(["express", "custom"]),
  description: z.string().optional(),
  address: addressSchema.strict(),
  surfaceArea: z.number().nonnegative(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  owner: z.object({
    structureType: z.string(),
    name: z.string().optional(),
  }),
  yearlyExpenses: expenseSchema.array(),
  yearlyIncomes: incomeSchema.array(),
  fullTimeJobsInvolved: z.number().nonnegative().optional(),
  tenant: z
    .object({
      structureType: z.string(),
      name: z.string().optional(),
    })
    .optional(),
  createdAt: z.date(),
});

export type NonFricheSite = z.infer<typeof nonFricheSiteSchema>;

export const fricheSchema = nonFricheSiteSchema.extend({
  isFriche: z.literal(true),
  fricheActivity: fricheActivitySchema.optional(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  accidentsMinorInjuries: z.number().nonnegative().optional(),
  accidentsSevereInjuries: z.number().nonnegative().optional(),
  accidentsDeaths: z.number().nonnegative().optional(),
});

export type FricheSite = z.infer<typeof fricheSchema>;

// discriminated unions might get deprecated in favor of a better solution: https://github.com/colinhacks/zod/issues/2106
export const siteSchema = z.discriminatedUnion("isFriche", [nonFricheSiteSchema, fricheSchema]);

export type Site = z.infer<typeof siteSchema>;
