import { SoilType } from "@/features/create-site/domain/siteFoncier.types";
import { LocalAndRegionalAuthority } from "@/shared/domain/localOrRegionalAuthority";
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
  photovoltaicFoundationsSurface: number;
  photovoltaicAccessPathsSurface: number;
  futureOperator: ProjectStakeholder;
  conversionFullTimeJobsInvolved: number;
  reinstatementFullTimeJobsInvolved?: number;
  reinstatementContractOwner?: ProjectStakeholder;
  operationsFullTimeJobsInvolved: number;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenue: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenue: Revenue[];
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
};

type Expense = {
  amount: number;
};

type Revenue = {
  amount: number;
};

type ProjectStakeholderStructure =
  | "company"
  | "local_or_regional_authority"
  | "unknown";

type ProjectStakeholder =
  | { name: string; structureType: ProjectStakeholderStructure }
  | {
      name: LocalAndRegionalAuthority;
      structureType: "local_or_regional_authority";
    };

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  owner: {
    id: string;
    name: string;
    structureType: ProjectStakeholderStructure;
  };
  tenant?: {
    id: string;
    name: string;
    structureType: ProjectStakeholderStructure;
  };
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
  surfaceArea: number;
};

const getPrevisionalProjectSocioEconomicImpactPerHectare = (
  projectType: ProjectType,
) => {
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

const getPrevisionalEnrSocioEconomicImpactPerHectare = (
  enrProjectType: RenewableEnergyType,
) => {
  switch (enrProjectType) {
    case RenewableEnergyType.AGRIVOLTAIC:
      return -21000;
    case RenewableEnergyType.BIOMASS:
      return -11000;
    case RenewableEnergyType.GEOTHERMAL:
      return 10000;
    case RenewableEnergyType.PHOTOVOLTAIC:
      return -10000;
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
