import { SoilType } from "@/shared/domain/soils";
import {
  LocalAutorityStructureType,
  OwnerStructureType,
  TenantStructureType,
} from "@/shared/domain/stakeholder";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";

export enum ProjectType {
  RENEWABLE_ENERGY = "RENEWABLE_ENERGY",
  URBAN_AGRICULTURE = "URBAN_AGRICULTURE",
  BUILDINGS = "BUILDINGS",
  NATURAL_URBAN_SPACES = "NATURAL_URBAN_SPACES",
}

export enum RenewableEnergyType {
  PHOTOVOLTAIC = "PHOTOVOLTAIC",
  AGRIVOLTAIC = "AGRIVOLTAIC",
  GEOTHERMAL = "GEOTHERMAL",
  BIOMASS = "BIOMASS",
}

export enum PhotovoltaicKeyParameter {
  POWER = "POWER",
  SURFACE = "SURFACE",
}

export type Project = {
  id: string;
  name: string;
  description?: string;
  relatedSiteId: string;
  types: ProjectType[];
  renewableEnergyTypes: RenewableEnergyType[];
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
  financialAssistanceRevenue: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenue: Revenue[];
  soilsDistribution: Partial<Record<SoilType, number>>;
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
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: Address;
};

const getPrevisionalProjectSocioEconomicImpactPerHectare = (projectType: ProjectType) => {
  switch (projectType) {
    case ProjectType.BUILDINGS:
      return 15000;
    case ProjectType.NATURAL_URBAN_SPACES:
      return 10000;
    case ProjectType.URBAN_AGRICULTURE:
      return 12000;
    case ProjectType.RENEWABLE_ENERGY:
      return 5000;
  }
};

export const getPrevisionalProjectSocioEconomicImpact = (
  projectType: ProjectType,
  siteSurfaceArea: number,
) => {
  return Math.round(
    getPrevisionalProjectSocioEconomicImpactPerHectare(projectType) *
      convertSquareMetersToHectares(siteSurfaceArea),
  );
};

const getPrevisionalEnrSocioEconomicImpactPerHectare = (enrProjectType: RenewableEnergyType) => {
  switch (enrProjectType) {
    case RenewableEnergyType.AGRIVOLTAIC:
      return 21000;
    case RenewableEnergyType.BIOMASS:
      return 11000;
    case RenewableEnergyType.GEOTHERMAL:
      return 10000;
    case RenewableEnergyType.PHOTOVOLTAIC:
      return 10000;
  }
};

export const getPrevisionalEnrSocioEconomicImpact = (
  enrProjectType: RenewableEnergyType,
  siteSurfaceArea: number,
) => {
  return Math.round(
    getPrevisionalEnrSocioEconomicImpactPerHectare(enrProjectType) *
      convertSquareMetersToHectares(siteSurfaceArea),
  );
};
