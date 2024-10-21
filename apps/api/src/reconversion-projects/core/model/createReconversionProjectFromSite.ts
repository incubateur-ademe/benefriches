import { addYears } from "date-fns";
import {
  computeProjectReinstatementCosts,
  computePropertyTransferDutiesFromSellingPrice,
  computeReinstatementFullTimeJobs,
  formatMunicipalityName,
  getSoilTypeForSpace,
  ReinstatementExpensePurpose,
  Schedule,
  SoilsDistribution,
  SpacesDistribution,
  typedObjectEntries,
} from "shared";

import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { Address } from "src/sites/core/models/site";

import { ReconversionProject, reconversionProjectSchema } from "./reconversionProject";
import { UrbanProjectFeatures } from "./urbanProjects";

type SiteData = {
  id: string;
  isFriche: boolean;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: Address;
  owner: {
    structureType: string;
    name?: string;
  };
};

type Input = {
  siteData: SiteData;
  reconversionProjectId: string;
  createdBy: string;
};

const computesitePurchaseFromSiteSurfaceArea = (
  surfaceArea: number,
): { sellingPrice: number; propertyTransactionDuties: number } => {
  const sellingPrice = surfaceArea * 72;
  const propertyTransactionDuties = computePropertyTransferDutiesFromSellingPrice(sellingPrice);
  return { sellingPrice, propertyTransactionDuties };
};

const computeInstallationCostsFromSiteSurfaceArea = (
  surfaceArea: number,
): { technicalStudies: number; developmentWorks: number; other: number } => {
  const technicalStudies = surfaceArea * 6;
  const developmentWorks = surfaceArea * 54;
  const other = (technicalStudies + developmentWorks) * 0.09;
  return { technicalStudies, developmentWorks, other };
};

const getReinstatementCostsFromSiteSoils = (
  siteSoilsDistribution: SoilsDistribution,
  projectSoilsDistribution: SoilsDistribution,
  decontaminatedSoilSurface: number,
) => {
  const costs: { amount: number; purpose: ReinstatementExpensePurpose }[] = [];

  const {
    deimpermeabilization,
    remediation,
    sustainableSoilsReinstatement,
    demolition,
    asbestosRemoval,
  } = computeProjectReinstatementCosts(
    siteSoilsDistribution,
    projectSoilsDistribution,
    decontaminatedSoilSurface,
  );

  if (deimpermeabilization) {
    costs.push({ amount: deimpermeabilization, purpose: "deimpermeabilization" });
  }

  if (sustainableSoilsReinstatement) {
    costs.push({
      amount: sustainableSoilsReinstatement,
      purpose: "sustainable_soils_reinstatement",
    });
  }

  if (remediation) {
    costs.push({ amount: remediation, purpose: "remediation" });
  }

  if (demolition) {
    costs.push({ amount: demolition, purpose: "demolition" });
  }

  if (asbestosRemoval) {
    costs.push({ amount: asbestosRemoval, purpose: "asbestos_removal" });
  }

  return costs;
};

const computeReinstatementSchedule = (dateProvider: IDateProvider): Schedule => {
  const startDate = addYears(dateProvider.now(), 1);
  const endDate = addYears(startDate, 1);
  return { startDate, endDate };
};

const JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR = 0.044;
const computeOperationsFullTimeJobs = (
  buildingsFloorAreaDistribution: UrbanProjectFeatures["buildingsFloorAreaDistribution"],
) => {
  return (
    JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR *
    (buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0)
  );
};

const computeInstallationSchedule =
  (dateProvider: IDateProvider) =>
  (startFrom?: Date): Schedule => {
    const startDate = startFrom ?? dateProvider.now();
    const endDate = addYears(startDate, 1);
    return { startDate, endDate };
  };

const computeOperationsFirstYear = (installationEndDate: Date): number => {
  return installationEndDate.getFullYear() + 1;
};

const computeSpacesDistribution = (siteSurfaceArea: number): SpacesDistribution => {
  return {
    BUILDINGS_FOOTPRINT: 0.2 * siteSurfaceArea,
    PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 0.07 * siteSurfaceArea,
    PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 0.02 * siteSurfaceArea,
    PRIVATE_GARDEN_AND_GRASS_ALLEYS: 0.37 * siteSurfaceArea,
    PUBLIC_GREEN_SPACES: 0.19 * siteSurfaceArea,
    PUBLIC_PARKING_LOT: 0.05 * siteSurfaceArea,
    PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.04 * siteSurfaceArea,
    PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.06 * siteSurfaceArea,
    PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 0,
  };
};

const computeSoilsDistributionFromSpaces = (
  spacesDistribution: SpacesDistribution,
): SoilsDistribution => {
  const soilsDistribution: SoilsDistribution = {};
  typedObjectEntries(spacesDistribution).forEach(([space, surfaceArea]) => {
    if (!surfaceArea) return;
    const relatedSoilType = getSoilTypeForSpace(space);
    const existingSurfaceArea = soilsDistribution[relatedSoilType];
    soilsDistribution[relatedSoilType] = existingSurfaceArea
      ? existingSurfaceArea + surfaceArea
      : surfaceArea;
  });
  return soilsDistribution;
};

const computeExpectedPostDevelopmentResaleFromSiteSurfaceArea = (
  surfaceArea: number,
): { sellingPrice: number; propertyTransferDuties: number } => {
  const sellingPrice = surfaceArea * 150 * 0.38;
  const propertyTransferDuties = computePropertyTransferDutiesFromSellingPrice(sellingPrice);
  return { sellingPrice, propertyTransferDuties };
};

const computeSitePurchaseValues = (
  siteSurfaceArea: number,
  developer: { structureType: string; name: string },
) => {
  const { sellingPrice, propertyTransactionDuties } =
    computesitePurchaseFromSiteSurfaceArea(siteSurfaceArea);

  return {
    futureSiteOwner: developer,
    sitePurchaseSellingPrice: sellingPrice,
    sitePurchasePropertyTransferDuties: propertyTransactionDuties,
  };
};

type Stakeholder = {
  structureType: string;
  name?: string;
};
const isFutureProjectDeveloperSiteOwner = (projectDeveloper: Stakeholder, siteOwner: Stakeholder) =>
  siteOwner.structureType === projectDeveloper.structureType &&
  siteOwner.name === projectDeveloper.name;

export class MixedUseNeighbourHoodReconversionProjectCreationService {
  constructor(private readonly dateProvider: IDateProvider) {}

  fromSiteData({ siteData, reconversionProjectId, createdBy }: Input): ReconversionProject {
    const developer = {
      name: formatMunicipalityName(siteData.address.city),
      structureType: "municipality",
    };

    // spaces and soils
    const spacesDistribution = computeSpacesDistribution(siteData.surfaceArea);
    const soilsDistribution = computeSoilsDistributionFromSpaces(spacesDistribution);

    const buildingsFloorAreaDistribution = {
      RESIDENTIAL: 0.35 * siteData.surfaceArea,
      GROUND_FLOOR_RETAIL: 0.03 * siteData.surfaceArea,
    };

    const decontaminatedSoilSurface = 0.75 * (siteData.contaminatedSoilSurface ?? 0);

    // expenses and incomes
    const installationCosts = computeInstallationCostsFromSiteSurfaceArea(siteData.surfaceArea);
    const reinstatementCosts = siteData.isFriche
      ? getReinstatementCostsFromSiteSoils(
          siteData.soilsDistribution,
          soilsDistribution,
          decontaminatedSoilSurface,
        )
      : undefined;

    const hasPurchaseTransaction = !isFutureProjectDeveloperSiteOwner(developer, siteData.owner);

    const sitePurchaseValues = hasPurchaseTransaction
      ? computeSitePurchaseValues(siteData.surfaceArea, developer)
      : {};

    // schedules
    const reinstatementSchedule = computeReinstatementSchedule(this.dateProvider);
    const installationSchedule = computeInstallationSchedule(this.dateProvider)(
      reinstatementSchedule.endDate,
    );

    // expected resale
    const siteResaleExpectedTransaction = computeExpectedPostDevelopmentResaleFromSiteSurfaceArea(
      siteData.surfaceArea,
    );
    const reinstatementContractOwner = siteData.isFriche ? developer : undefined;

    const reconversionProject: ReconversionProject = {
      id: reconversionProjectId,
      createdBy,
      createdAt: this.dateProvider.now(),
      creationMode: "express",
      projectPhase: "planning",
      soilsDistribution,
      decontaminatedSoilSurface,
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      name: "Quartier mixte",
      relatedSiteId: siteData.id,
      reinstatementCosts,
      reinstatementSchedule,
      reinstatementFullTimeJobsInvolved: computeReinstatementFullTimeJobs(reinstatementCosts),
      operationsFullTimeJobsInvolved: computeOperationsFullTimeJobs(buildingsFloorAreaDistribution),
      operationsFirstYear: computeOperationsFirstYear(installationSchedule.endDate),
      reinstatementContractOwner,
      developmentPlan: {
        developer,
        features: {
          spacesDistribution,
          buildingsFloorAreaDistribution,
        },
        installationSchedule,
        type: "URBAN_PROJECT",
        costs: [
          { amount: installationCosts.technicalStudies, purpose: "technical_studies" },
          { amount: installationCosts.developmentWorks, purpose: "development_works" },
          { amount: installationCosts.other, purpose: "other" },
        ],
      },
      ...sitePurchaseValues,
      siteResaleExpectedSellingPrice: siteResaleExpectedTransaction.sellingPrice,
      siteResaleExpectedPropertyTransferDuties:
        siteResaleExpectedTransaction.propertyTransferDuties,
    };
    const parsed = reconversionProjectSchema.parse(reconversionProject);

    return parsed;
  }
}
