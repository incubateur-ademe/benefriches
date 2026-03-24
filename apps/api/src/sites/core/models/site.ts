import {
  Address,
  addressSchema,
  AgriculturalOperationActivity,
  createSoilSurfaceAreaDistribution,
  FricheActivity,
  fricheActivitySchema,
  NaturalAreaType,
  siteNatureSchema,
  SiteYearlyExpense,
  siteYearlyExpenseSchema,
  SiteYearlyIncome,
  SoilType,
  SurfaceAreaDistribution,
  typedObjectEntries,
  urbanZoneLandParcelSchema,
  urbanZoneTypeSchema,
} from "shared";
import type { SoilsDistribution, UrbanZoneLandParcel, UrbanZoneType } from "shared";
import { z } from "zod";
import { $ZodFlattenedError } from "zod/v4/core";

const incomeSchema = z.object({
  source: z.string(),
  amount: z.number().nonnegative(),
});

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
  soilsDistribution: SoilsDistribution;
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
  const soilsDistribution = createSoilSurfaceAreaDistribution(props.soilsDistribution);
  const surfaceArea = soilsDistribution.getTotalSurfaceArea();

  const candidate = {
    id: props.id,
    name: props.name,
    nature: props.nature,
    description: props.description,
    address: props.address,
    soilsDistribution,
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
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
  soilsDistribution: SoilsDistribution;
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
  const soilsDistribution = createSoilSurfaceAreaDistribution(props.soilsDistribution);
  const surfaceArea = soilsDistribution.getTotalSurfaceArea();
  const hasContaminatedSoils = !!props.contaminatedSoilSurface;

  if (surfaceArea === 0) {
    return {
      success: false,
      error: {
        fieldErrors: { soilsDistribution: ["Total surface area must be greater than 0"] },
        formErrors: [],
      },
    };
  }

  const candidate = {
    id: props.id,
    name: props.name,
    nature: "FRICHE",
    description: props.description,
    address: props.address,
    soilsDistribution,
    owner,
    tenant: props.tenant,
    yearlyExpenses: props.yearlyExpenses,
    yearlyIncomes: [],
    surfaceArea,
    fricheActivity,
    hasContaminatedSoils,
    contaminatedSoilSurface: props.contaminatedSoilSurface || undefined,
    accidentsMinorInjuries: props.accidentsMinorInjuries,
    accidentsSevereInjuries: props.accidentsSevereInjuries,
    accidentsDeaths: props.accidentsDeaths,
  };

  const result = fricheSchema.safeParse(candidate);

  return result.success
    ? {
        success: true,
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        site: result.data as unknown as Friche,
      }
    : {
        success: false,
        error: z.flattenError(result.error),
      };
}

export interface UrbanZoneSite extends BaseSite {
  nature: "URBAN_ZONE";
  urbanZoneType: UrbanZoneType;
  landParcels: UrbanZoneLandParcel[];
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  manager: { structureType: string; name: string };
  vacantCommercialPremisesFootprint: number;
  vacantCommercialPremisesFloorArea?: number;
  fullTimeJobsEquivalent?: number;
}

const urbanZoneSiteSchema = baseSiteSchema.extend({
  nature: z.literal("URBAN_ZONE"),
  urbanZoneType: urbanZoneTypeSchema,
  landParcels: urbanZoneLandParcelSchema.array().nonempty(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().nonnegative().optional(),
  manager: z.object({ structureType: z.string(), name: z.string() }),
  vacantCommercialPremisesFootprint: z.number().nonnegative(),
  vacantCommercialPremisesFloorArea: z.number().nonnegative().optional(),
  fullTimeJobsEquivalent: z.number().nonnegative().optional(),
});

export type CreateUrbanZoneSiteProps = {
  id: string;
  name: string;
  description?: string;
  address: Address;
  owner?: { structureType: string; name: string };
  yearlyExpenses: SiteYearlyExpense[];
  yearlyIncomes: SiteYearlyIncome[];
  urbanZoneType: UrbanZoneType;
  landParcels: UrbanZoneLandParcel[];
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  manager: { structureType: string; name: string };
  vacantCommercialPremisesFootprint: number;
  vacantCommercialPremisesFloorArea?: number;
  fullTimeJobsEquivalent?: number;
};

type UrbanZoneSiteCreationResult =
  | { success: true; site: UrbanZoneSite }
  | { success: false; error: $ZodFlattenedError<z.infer<typeof urbanZoneSiteSchema>> };

export function aggregateSoilsFromParcels(
  landParcels: UrbanZoneLandParcel[],
): SurfaceAreaDistribution<SoilType> {
  const aggregated = new SurfaceAreaDistribution<SoilType>();
  for (const parcel of landParcels) {
    for (const [soilType, area] of typedObjectEntries(parcel.soilsDistribution)) {
      aggregated.addSurface(soilType, area ?? 0);
    }
  }
  return aggregated;
}

export function createUrbanZoneSite(props: CreateUrbanZoneSiteProps): UrbanZoneSiteCreationResult {
  const owner = props.owner ?? { name: "Propriétaire inconnu", structureType: "unknown" };
  const soilsDistribution = aggregateSoilsFromParcels(props.landParcels);
  const surfaceArea = soilsDistribution.getTotalSurfaceArea();

  const candidate = {
    id: props.id,
    name: props.name,
    nature: "URBAN_ZONE",
    description: props.description,
    address: props.address,
    soilsDistribution,
    owner,
    yearlyExpenses: props.yearlyExpenses,
    yearlyIncomes: props.yearlyIncomes ?? [],
    surfaceArea,
    urbanZoneType: props.urbanZoneType,
    landParcels: props.landParcels,
    hasContaminatedSoils: props.hasContaminatedSoils,
    contaminatedSoilSurface: props.contaminatedSoilSurface,
    manager: props.manager,
    vacantCommercialPremisesFootprint: props.vacantCommercialPremisesFootprint,
    vacantCommercialPremisesFloorArea: props.vacantCommercialPremisesFloorArea,
    fullTimeJobsEquivalent: props.fullTimeJobsEquivalent,
  };

  const result = urbanZoneSiteSchema.safeParse(candidate);

  return result.success
    ? {
        success: true,
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        site: result.data as unknown as UrbanZoneSite,
      }
    : {
        success: false,
        error: z.flattenError(result.error),
      };
}

export type Site = Friche | AgriculturalOperationSite | NaturalAreaSite | UrbanZoneSite;
