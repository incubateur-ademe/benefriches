import { z } from "zod";

import { SoilType } from "@/shared/domain/soils";
import {
  LocalAutorityStructureType,
  OwnerStructureType,
  TenantStructureType,
} from "@/shared/domain/stakeholder";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";

export type DevelopmentPlanCategory =
  | "RENEWABLE_ENERGY"
  | "URBAN_AGRICULTURE"
  | "BUILDINGS"
  | "NATURAL_URBAN_SPACES";

export const renewableEnergyProductionDevelopmentPlanTypeSchema = z.enum([
  "PHOTOVOLTAIC_POWER_PLANT",
  "AGRIVOLTAIC",
  "GEOTHERMAL",
  "BIOMASS",
]);
export type RenewableEnergyDevelopmentPlanType = z.infer<
  typeof renewableEnergyProductionDevelopmentPlanTypeSchema
>;

export enum PhotovoltaicKeyParameter {
  POWER = "POWER",
  SURFACE = "SURFACE",
}

export type Project = {
  id: string;
  name: string;
  description?: string;
  relatedSiteId: string;
  developmentPlanCategory: DevelopmentPlanCategory[];
  renewableEnergyTypes: RenewableEnergyDevelopmentPlanType[];
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
  photovoltaicInstallationElectricalPowerKWc: number;
  photovoltaicInstallationSurfaceSquareMeters: number;
  photovoltaicExpectedAnnualProduction: number;
  photovoltaicContractDuration: number;
  futureOperator: ProjectStakeholder;
  conversionFullTimeJobsInvolved?: number;
  reinstatementFullTimeJobsInvolved?: number;
  reinstatementContractOwner?: ProjectStakeholder;
  operationsFullTimeJobsInvolved?: number;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  reinstatementFinancialAssistanceAmount: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenues: Revenue[];
  soilsDistribution: Partial<Record<SoilType, number>>;
  reinstatementSchedule?: {
    startDate: string;
    endDate: string;
  };
  photovoltaicInstallationSchedule?: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation?: string;
};

export type DocumentType = "BUILDING_PERMIT" | "FORECAST_BALANCE_SHEET";

type Expense = {
  amount: number;
};

type Revenue = {
  amount: number;
};

type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
  | LocalAutorityStructureType
  | "other"
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

export type Address = {
  id: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  streetNumber?: string;
  streetName?: string;
  long: number;
  lat: number;
};

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  owner: {
    name: string;
    structureType: OwnerStructureType;
  };
  tenant?: {
    name: string;
    structureType: TenantStructureType;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: Address;
};

const getPrevisionalProjectSocioEconomicImpactPerHectare = (
  projectType: DevelopmentPlanCategory,
) => {
  switch (projectType) {
    case "BUILDINGS":
      return 15000;
    case "NATURAL_URBAN_SPACES":
      return 10000;
    case "URBAN_AGRICULTURE":
      return 12000;
    case "RENEWABLE_ENERGY":
      return 5000;
  }
};

export const getPrevisionalProjectSocioEconomicImpact = (
  projectType: DevelopmentPlanCategory,
  siteSurfaceArea: number,
) => {
  return Math.round(
    getPrevisionalProjectSocioEconomicImpactPerHectare(projectType) *
      convertSquareMetersToHectares(siteSurfaceArea),
  );
};

const getPrevisionalEnrSocioEconomicImpactPerHectare = (
  renewableEnergyProductionType: RenewableEnergyDevelopmentPlanType,
) => {
  switch (renewableEnergyProductionType) {
    case "AGRIVOLTAIC":
      return 21000;
    case "BIOMASS":
      return 11000;
    case "GEOTHERMAL":
      return 10000;
    case "PHOTOVOLTAIC_POWER_PLANT":
      return 10000;
  }
};

export const getPrevisionalEnrSocioEconomicImpact = (
  renewableEnergyProductionType: RenewableEnergyDevelopmentPlanType,
  siteSurfaceArea: number,
) => {
  return Math.round(
    getPrevisionalEnrSocioEconomicImpactPerHectare(renewableEnergyProductionType) *
      convertSquareMetersToHectares(siteSurfaceArea),
  );
};
