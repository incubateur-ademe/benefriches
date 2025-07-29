import { z } from "zod";
import { $ZodFlattenedError } from "zod/v4/core";

import { SoilType } from "../soils";
import { SurfaceAreaDistribution } from "../surface-area";
import { AgriculturalOperationActivity } from "./agricultural-operation";
import { FricheActivity, fricheActivitySchema } from "./friche/fricheActivity";
import { NaturalAreaType } from "./natural-area";
import { SiteYearlyExpense, siteYearlyExpenseSchema } from "./yearlyExpenses";
import { SiteYearlyIncome } from "./yearlyIncome";

export const siteNatureSchema = z.enum(["FRICHE", "AGRICULTURAL_OPERATION", "NATURAL_AREA"]);
export type SiteNature = z.infer<typeof siteNatureSchema>;

const incomeSchema = z.object({
  source: z.string(),
  amount: z.number().nonnegative(),
});

export const addressSchema = z.object({
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

const baseSiteSchema = z.object({
  id: z.uuid(),
  nature: siteNatureSchema,
  name: z.string(),
  description: z.string().optional(),
  address: addressSchema.strict(),
  surfaceArea: z.number().nonnegative(),
  soilsDistribution: z.instanceof(SurfaceAreaDistribution<SoilType>),
  owner: z.object({
    structureType: z.string(),
    name: z.string(),
  }),
  yearlyExpenses: siteYearlyExpenseSchema.array(),
  yearlyIncomes: incomeSchema.array().optional(),
  tenant: z
    .object({
      structureType: z.string(),
      name: z.string(),
    })
    .optional(),
});

export const naturalAreaSchema = baseSiteSchema.extend({
  nature: z.literal("NATURAL_AREA"),
  naturalAreaType: z.string(),
});

export const agriculturalOperationSchema = baseSiteSchema.extend({
  nature: z.literal("AGRICULTURAL_OPERATION"),
  agriculturalOperationActivity: z.string(),
  isSiteOperated: z.boolean(),
});

export const fricheSchema = baseSiteSchema.extend({
  nature: z.literal("FRICHE"),
  fricheActivity: fricheActivitySchema,
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  accidentsMinorInjuries: z.number().nonnegative().optional(),
  accidentsSevereInjuries: z.number().nonnegative().optional(),
  accidentsDeaths: z.number().nonnegative().optional(),
});

interface BaseSite {
  id: string;
  address: Address;
  soilsDistribution: SurfaceAreaDistribution<SoilType>;
  owner: {
    structureType: string;
    name: string;
  };
  tenant?: {
    structureType: string;
    name: string;
  };
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
  name: string;
  description?: string;
  surfaceArea: number;
}

export interface Friche extends BaseSite {
  nature: "FRICHE";
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  fricheActivity: FricheActivity;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
}

export interface AgriculturalOperationSite extends BaseSite {
  nature: "AGRICULTURAL_OPERATION";
  yearlyIncomes: SiteYearlyIncome[];
  agriculturalOperationActivity: AgriculturalOperationActivity;
  isSiteOperated: boolean;
}

export interface NaturalAreaSite extends BaseSite {
  nature: "NATURAL_AREA";
  yearlyIncomes: SiteYearlyIncome[];
  naturalAreaType: NaturalAreaType;
}

export type AgriculturalOrNaturalSite = AgriculturalOperationSite | NaturalAreaSite;

type AgriculturalOperationCreationResult =
  | { success: true; site: AgriculturalOperationSite }
  | { success: false; error: $ZodFlattenedError<z.infer<typeof agriculturalOperationSchema>> };
type NaturalAreaCreationResult =
  | { success: true; site: NaturalAreaSite }
  | { success: false; error: $ZodFlattenedError<z.infer<typeof naturalAreaSchema>> };

type CreateNaturalAreaSiteProps = {
  nature: "NATURAL_AREA";
  naturalAreaType: NaturalAreaType;
} & CreateAgriculturalOrNaturalSiteCommonProps;

type CreateAgriculturalOperationSiteProps = {
  nature: "AGRICULTURAL_OPERATION";
  agriculturalOperationActivity: AgriculturalOperationActivity;
  isSiteOperated: boolean;
} & CreateAgriculturalOrNaturalSiteCommonProps;

type CreateAgriculturalOrNaturalSiteCommonProps = {
  id: string;
  name: string;
  description?: string;
  address: Address;
  soilsDistribution: SurfaceAreaDistribution<SoilType>;
  owner?: { structureType: string; name: string };
  tenant?: { structureType: string; name: string };
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
};

export type CreateAgriculturalOrNaturalSiteProps =
  | CreateNaturalAreaSiteProps
  | CreateAgriculturalOperationSiteProps;

export function createAgriculturalOrNaturalSite(
  props: CreateAgriculturalOrNaturalSiteProps,
): AgriculturalOperationCreationResult | NaturalAreaCreationResult {
  const owner = props.owner ?? { name: "Propriétaire inconnu", structureType: "unknown" };
  const surfaceArea = props.soilsDistribution.getTotalSurfaceArea();

  const candidate = {
    id: props.id,
    name: props.name,
    nature: props.nature,
    description: props.description,
    address: props.address,
    soilsDistribution: props.soilsDistribution,
    owner,
    tenant: props.tenant,
    yearlyExpenses: props.yearlyExpenses,
    yearlyIncomes: props.yearlyIncomes,
    surfaceArea,
  };

  if (props.nature === "AGRICULTURAL_OPERATION") {
    const result = agriculturalOperationSchema.safeParse({
      ...candidate,
      isSiteOperated: props.isSiteOperated,
      agriculturalOperationActivity: props.agriculturalOperationActivity,
    });

    return result.success
      ? {
          success: true,
          site: result.data as AgriculturalOperationSite,
        }
      : {
          success: false,
          error: z.flattenError(result.error),
        };
  }

  const result = naturalAreaSchema.safeParse({
    ...candidate,
    naturalAreaType: props.naturalAreaType,
  });

  return result.success
    ? {
        success: true,
        site: result.data as NaturalAreaSite,
      }
    : {
        success: false,
        error: z.flattenError(result.error),
      };
}

export type CreateFricheProps = {
  id: string;
  name: string;
  description?: string;
  address: Address;
  soilsDistribution: SurfaceAreaDistribution<SoilType>;
  owner?: { structureType: string; name: string };
  tenant?: { structureType: string; name: string };
  fricheActivity?: FricheActivity;
  contaminatedSoilSurface?: number;
  yearlyExpenses: SiteYearlyExpense[];
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
};

type FricheCreationResult =
  | { success: true; site: Friche }
  | { success: false; error: $ZodFlattenedError<z.infer<typeof fricheSchema>> };

export function createFriche(props: CreateFricheProps): FricheCreationResult {
  const fricheActivity = props.fricheActivity ?? "OTHER";
  const owner = props.owner ?? { name: "Propriétaire inconnu", structureType: "unknown" };
  const surfaceArea = props.soilsDistribution.getTotalSurfaceArea();
  const hasContaminatedSoils = !!props.contaminatedSoilSurface;

  const candidate = {
    id: props.id,
    name: props.name,
    nature: "FRICHE",
    description: props.description,
    address: props.address,
    soilsDistribution: props.soilsDistribution,
    owner,
    tenant: props.tenant,
    yearlyExpenses: props.yearlyExpenses,
    yearlyIncomes: [],
    surfaceArea,
    fricheActivity,
    hasContaminatedSoils,
    contaminatedSoilSurface: props.contaminatedSoilSurface,
    accidentsMinorInjuries: props.accidentsMinorInjuries,
    accidentsSevereInjuries: props.accidentsSevereInjuries,
    accidentsDeaths: props.accidentsDeaths,
  };

  const result = fricheSchema.safeParse(candidate);

  return result.success
    ? {
        success: true,
        site: result.data as unknown as Friche,
      }
    : {
        success: false,
        error: z.flattenError(result.error),
      };
}

export type Site = Friche | AgriculturalOperationSite | NaturalAreaSite;
