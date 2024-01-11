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
  type: z.string(),
  bearer: z.string(),
  category: z.string(),
  amount: z.number().nonnegative(),
});

const incomeSchema = z.object({
  type: z.string(),
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

export const nonFricheSitePropsSchema = z.object({
  isFriche: z.literal(false),
  id: z.string().uuid(),
  name: z.string(),
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
});

export type NonFricheSite = z.infer<typeof nonFricheSitePropsSchema>;

export const frichePropsSchema = nonFricheSitePropsSchema.extend({
  isFriche: z.literal(true),
  fricheActivity: fricheActivitySchema,
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  accidentsMinorInjuries: z.number().nonnegative().optional(),
  accidentsSevereInjuries: z.number().nonnegative().optional(),
  accidentsDeaths: z.number().nonnegative().optional(),
});

export type FricheSite = z.infer<typeof frichePropsSchema>;

export const sitePropsSchema = z.discriminatedUnion("isFriche", [
  nonFricheSitePropsSchema,
  frichePropsSchema,
]);

export type Site = z.infer<typeof sitePropsSchema>;
