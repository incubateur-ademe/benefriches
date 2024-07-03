import { addYears } from "date-fns";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { typedObjectEntries } from "src/shared-kernel/typedEntries";
import { Address } from "src/sites/core/models/site";
import {
  isImpermeableSoil,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "src/soils/domain/soils";
import {
  getSoilTypeForSpace,
  MixedUseNeighbourhoodFeatures,
  SpacesDistribution,
} from "./mixedUseNeighbourhood";
import {
  ReconversionProject,
  reconversionProjectSchema,
  ReinstatementCostsPurpose,
  Schedule,
} from "./reconversionProject";

type SiteData = {
  id: string;
  isFriche: boolean;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: Address;
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
  const propertyTransactionDuties = sellingPrice * 0.0581;
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

const getImpermeableSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return sumSoilsSurfaceAreasWhere(soilsDistribution, (soilType) => isImpermeableSoil(soilType));
};

const computeReinstatementCostsFromSiteSoils = (
  siteSoilsDistribution: SoilsDistribution,
  projectSoilsDistribution: SoilsDistribution,
  contaminatedSoilSurface: number,
) => {
  const costs = [];

  const impermeableSoilsDelta =
    getImpermeableSurfaceArea(siteSoilsDistribution) -
    getImpermeableSurfaceArea(projectSoilsDistribution);

  if (impermeableSoilsDelta > 0) {
    costs.push({ amount: impermeableSoilsDelta * 10, purpose: "deimpermeabilization" });
  }

  if (contaminatedSoilSurface > 0) {
    costs.push({ amount: contaminatedSoilSurface * 0.75 * 66, purpose: "remediation" });
  }

  if (siteSoilsDistribution.BUILDINGS) {
    costs.push({ amount: siteSoilsDistribution.BUILDINGS * 75, purpose: "demolition" });
    costs.push({ amount: siteSoilsDistribution.BUILDINGS * 75, purpose: "asbestos_removal" });
  }

  return costs;
};

const computeReinstatementSchedule = (dateProvider: IDateProvider): Schedule => {
  const startDate = addYears(dateProvider.now(), 1);
  const endDate = addYears(startDate, 1);
  return { startDate, endDate };
};

const REINSTATEMENT_JOBS_RATIOS_PER_EURO_PER_YEAR: Partial<
  Record<ReinstatementCostsPurpose, number>
> = {
  sustainable_soils_reinstatement: 14 / 1000000,
  deimpermeabilization: 5.45 / 1000000,
  asbestos_removal: 6 / 1000000,
  demolition: 6 / 1000000,
  waste_collection: 5.7 / 1000000,
  remediation: 5 / 1000000,
};

export const computeReinstatementFullTimeJobs = (
  reinstatementCosts: ReconversionProject["reinstatementCosts"] = [],
) => {
  const reinstatementFullTimeJobs = reinstatementCosts.map(({ purpose, amount }) => {
    const ratio = REINSTATEMENT_JOBS_RATIOS_PER_EURO_PER_YEAR[purpose as ReinstatementCostsPurpose];
    return ratio ? amount * ratio : 0;
  }, 0);
  return Math.round(reinstatementFullTimeJobs.reduce((total, jobs) => total + jobs, 0) * 10) / 10;
};

const JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR = 0.04;
const computeOperationsFullTimeJobs = (
  buildingsFloorAreaDistribution: MixedUseNeighbourhoodFeatures["buildingsFloorAreaDistribution"],
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
  return installationEndDate.getFullYear();
};

const computeSpacesDistribution = (siteSurfaceArea: number): SpacesDistribution => {
  return {
    BUILDINGS_FOOTPRINT: 0.2 * siteSurfaceArea,
    PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 0.05 * siteSurfaceArea,
    PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 0.02 * siteSurfaceArea,
    PRIVATE_GARDEN_AND_GRASS_ALLEYS: 0.37 * siteSurfaceArea,
    PUBLIC_GREEN_SPACES: 0.19 * siteSurfaceArea,
    PUBLIC_PARKING_LOT: 0.05 * siteSurfaceArea,
    PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.04 * siteSurfaceArea,
    PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.07 * siteSurfaceArea,
    PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.01 * siteSurfaceArea,
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
  const propertyTransferDuties = sellingPrice * 0.0581;
  return { sellingPrice, propertyTransferDuties };
};

export class MixedUseNeighbourHoodReconversionProjectCreationService {
  constructor(private readonly dateProvider: IDateProvider) {}

  fromSiteData({ siteData, reconversionProjectId, createdBy }: Input): ReconversionProject {
    // spaces and soils
    const spacesDistribution = computeSpacesDistribution(siteData.surfaceArea);
    const soilsDistribution = computeSoilsDistributionFromSpaces(spacesDistribution);

    const buildingsFloorAreaDistribution = {
      RESIDENTIAL: 0.92 * 0.2 * siteData.surfaceArea,
      GROUND_FLOOR_RETAIL: 0.08 * 0.2 * siteData.surfaceArea,
    };

    // expenses and incomes
    const { sellingPrice, propertyTransactionDuties } = computesitePurchaseFromSiteSurfaceArea(
      siteData.surfaceArea,
    );
    const installationCosts = computeInstallationCostsFromSiteSurfaceArea(siteData.surfaceArea);
    const reinstatementCosts = siteData.isFriche
      ? computeReinstatementCostsFromSiteSoils(
          siteData.soilsDistribution,
          soilsDistribution,
          siteData.contaminatedSoilSurface ?? 0,
        )
      : undefined;

    // schedules
    const reinstatementSchedule = computeReinstatementSchedule(this.dateProvider);
    const installationSchedule = computeInstallationSchedule(this.dateProvider)(
      reinstatementSchedule.endDate,
    );

    // expected resale
    const siteResaleExpectedTransaction = computeExpectedPostDevelopmentResaleFromSiteSurfaceArea(
      siteData.surfaceArea,
    );

    const developer = {
      name: siteData.address.city,
      structureType: "local_or_regional_authority",
    };
    const reinstatementContractOwner = siteData.isFriche ? developer : undefined;

    const reconversionProject: ReconversionProject = {
      id: reconversionProjectId,
      createdBy,
      createdAt: this.dateProvider.now(),
      projectPhase: "planning",
      soilsDistribution,
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      name: "Quartier mixte",
      relatedSiteId: siteData.id,
      reinstatementCosts,
      reinstatementSchedule,
      reinstatementFullTimeJobsInvolved: computeReinstatementFullTimeJobs(reinstatementCosts),
      operationsFullTimeJobsInvolved: computeOperationsFullTimeJobs(buildingsFloorAreaDistribution),
      operationsFirstYear: computeOperationsFirstYear(installationSchedule.endDate),
      futureSiteOwner: developer,
      reinstatementContractOwner,
      developmentPlan: {
        developer,
        features: {
          spacesDistribution,
          buildingsFloorAreaDistribution,
        },
        installationSchedule,
        type: "MIXED_USE_NEIGHBOURHOOD",
        costs: [
          { amount: installationCosts.technicalStudies, purpose: "technical_studies" },
          { amount: installationCosts.developmentWorks, purpose: "development_works" },
          { amount: installationCosts.other, purpose: "other" },
        ],
      },
      sitePurchaseSellingPrice: sellingPrice,
      sitePurchasePropertyTransferDuties: propertyTransactionDuties,
      siteResaleExpectedSellingPrice: siteResaleExpectedTransaction.sellingPrice,
      siteResaleExpectedPropertyTransferDuties:
        siteResaleExpectedTransaction.propertyTransferDuties,
    };
    const parsed = reconversionProjectSchema.parse(reconversionProject);

    return parsed;
  }
}
