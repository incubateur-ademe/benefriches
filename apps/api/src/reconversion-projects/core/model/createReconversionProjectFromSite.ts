import { addYears } from "date-fns";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { typedObjectEntries } from "src/shared-kernel/typedEntries";
import { Address } from "src/sites/core/models/site";
import {
  isImpermeableSoil,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "src/soils/domain/soils";
import { getSoilTypeForSpace, SpacesDistribution } from "./mixedUseNeighbourhood";
import { ReconversionProject, reconversionProjectSchema, Schedule } from "./reconversionProject";

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

const computeRealEstateTransactionFromSiteSurfaceArea = (
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
    costs.push({ amount: siteSoilsDistribution.BUILDINGS * 75, purpose: "absestos_removal" });
  }

  return costs;
};

const computeReinstatementSchedule = (dateProvider: IDateProvider): Schedule => {
  const startDate = addYears(dateProvider.now(), 1);
  const endDate = addYears(startDate, 1);
  return { startDate, endDate };
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

export class MixedUseNeighbourHoodReconversionProjectCreationService {
  constructor(private readonly dateProvider: IDateProvider) {}

  fromSiteData({ siteData, reconversionProjectId, createdBy }: Input): ReconversionProject {
    // spaces and soils
    const spacesDistribution = computeSpacesDistribution(siteData.surfaceArea);
    const soilsDistribution = computeSoilsDistributionFromSpaces(spacesDistribution);

    // expenses and incomes
    const { sellingPrice, propertyTransactionDuties } =
      computeRealEstateTransactionFromSiteSurfaceArea(siteData.surfaceArea);
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

    const reconversionProject: ReconversionProject = {
      id: reconversionProjectId,
      createdBy,
      createdAt: this.dateProvider.now(),
      projectPhase: "planning",
      soilsDistribution,
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      name: "Quartir mixte",
      relatedSiteId: siteData.id,
      reinstatementCosts,
      reinstatementSchedule,
      operationsFirstYear: computeOperationsFirstYear(installationSchedule.endDate),
      futureSiteOwner: {
        name: siteData.address.city,
        structureType: "local_or_regional_authority",
      },
      developmentPlan: {
        developer: {
          name: siteData.address.city,
          structureType: "local_or_regional_authority",
        },
        features: {
          spacesDistribution,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 0.92 * 0.2 * siteData.surfaceArea,
            GROUND_FLOOR_RETAIL: 0.08 * 0.2 * siteData.surfaceArea,
          },
        },
        installationSchedule,
        type: "MIXED_USE_NEIGHBOURHOOD",
        costs: [
          { amount: installationCosts.technicalStudies, purpose: "technical_studies" },
          { amount: installationCosts.developmentWorks, purpose: "development_works" },
          { amount: installationCosts.other, purpose: "other" },
        ],
      },
      realEstateTransactionSellingPrice: sellingPrice,
      realEstateTransactionPropertyTransferDuties: propertyTransactionDuties,
    };
    const parsed = reconversionProjectSchema.parse(reconversionProject);

    return parsed;
  }
}
