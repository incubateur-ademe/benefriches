import { IDateProvider } from "../../../adapters/IDateProvider";
import { computePropertyTransferDutiesFromSellingPrice } from "../../../financial";
import { formatMunicipalityName } from "../../../local-authority";
import { typedObjectEntries } from "../../../object-entries";
import { computeDefaultSitePurchaseFromSiteSurfaceArea } from "../../_common";
import { DefaultProjectGenerator } from "../../_common/project-generator/DefaultProjectGenerator";
import { ReconversionProject, SiteData } from "../../_common/project-generator/types";
import {
  ReconversionProjectSoilsDistribution,
  saveReconversionProjectSchema,
} from "../../reconversionProjectSchemas";
import { computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces } from "../expectedPostDevelopmentResale";
import { computeDefaultInstallationExpensesFromSiteSurfaceArea } from "../installationExpenses";
import { BuildingsUseDistribution } from "../spaces/living-and-activity-spaces/buildingsUse";
import { LEGACY_SpacesDistribution } from "../urbanProject";

export class UrbanProjectGenerator extends DefaultProjectGenerator {
  name;
  developmentType;

  constructor(
    dateProvider: IDateProvider,
    private readonly reconversionProjectId: string,
    private readonly createdBy: string,
    override readonly siteData: SiteData & { address: { city: string } },
  ) {
    super(dateProvider, siteData);
    this.name = "";
    this.developmentType = "URBAN_PROJECT" as const;
  }

  get spacesDistribution(): LEGACY_SpacesDistribution {
    return {};
  }

  get buildingsFloorAreaDistribution(): BuildingsUseDistribution {
    return {};
  }

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return typedObjectEntries(this.spacesDistribution).map(([spaceType, surfaceArea = 0]) => {
      switch (spaceType) {
        case "BUILDINGS_FOOTPRINT":
          return {
            surfaceArea,
            soilType: "BUILDINGS",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          };
        case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
          return {
            surfaceArea,
            soilType: "IMPERMEABLE_SOILS",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          };
        case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
          return {
            surfaceArea,
            soilType: "MINERAL_SOIL",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          };
        case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
          return {
            surfaceArea,
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          };
        case "PUBLIC_GREEN_SPACES":
          return {
            surfaceArea,
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            spaceCategory: "PUBLIC_GREEN_SPACE",
          };
        case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
          return {
            surfaceArea,
            soilType: "IMPERMEABLE_SOILS",
            spaceCategory: "PUBLIC_SPACE",
          };
        case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
          return {
            surfaceArea,
            soilType: "MINERAL_SOIL",
            spaceCategory: "PUBLIC_SPACE",
          };
        case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
          return {
            surfaceArea,
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          };
        case "PUBLIC_PARKING_LOT":
          return {
            surfaceArea,
            soilType: "IMPERMEABLE_SOILS",
            spaceCategory: "PUBLIC_SPACE",
          };
      }
    });
  }

  override get developer() {
    return {
      name: formatMunicipalityName(this.siteData.address.city),
      structureType: "municipality",
    };
  }

  // expenses and incomes
  get installationCosts() {
    const { technicalStudies, developmentWorks, other } =
      computeDefaultInstallationExpensesFromSiteSurfaceArea(this.siteData.surfaceArea);
    return [
      { amount: technicalStudies, purpose: "technical_studies" },
      { amount: developmentWorks, purpose: "development_works" },
      { amount: other, purpose: "other" },
    ];
  }

  get hasPurchaseTransaction() {
    const isFutureProjectDeveloperSiteOwner =
      this.siteData.owner.structureType === this.developer.structureType &&
      this.siteData.owner.name === this.developer.name;
    return !isFutureProjectDeveloperSiteOwner;
  }

  get futureSiteOwner() {
    if (this.hasPurchaseTransaction) {
      return this.developer;
    }
    return undefined;
  }

  get sitePurchaseValues() {
    if (this.hasPurchaseTransaction) {
      return computeDefaultSitePurchaseFromSiteSurfaceArea(this.siteData.surfaceArea);
    }
    return { sellingPrice: undefined, propertyTransactionDuties: undefined };
  }

  // expected resale
  get siteResaleExpectedSellingPrice() {
    return computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces(
      this.buildingsFloorAreaDistribution,
    );
  }

  get siteResaleExpectedPropertyTransferDuties() {
    return computePropertyTransferDutiesFromSellingPrice(this.siteResaleExpectedSellingPrice);
  }

  getReconversionProject(): ReconversionProject {
    return saveReconversionProjectSchema.parse({
      id: this.reconversionProjectId,
      createdBy: this.createdBy,
      createdAt: this.dateProvider.now(),
      creationMode: "express",
      projectPhase: "planning",
      soilsDistribution: this.projectSoilsDistribution,
      decontaminatedSoilSurface: this.decontaminatedSoilSurface,
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      relatedSiteId: this.siteData.id,
      futureSiteOwner: this.futureSiteOwner,
      sitePurchaseSellingPrice: this.sitePurchaseValues.sellingPrice,
      sitePurchasePropertyTransferDuties: this.sitePurchaseValues.propertyTransactionDuties,
      siteResaleExpectedSellingPrice: this.siteResaleExpectedSellingPrice,
      siteResaleExpectedPropertyTransferDuties: this.siteResaleExpectedPropertyTransferDuties,
      reinstatementCosts: this.reinstatementCosts,
      reinstatementSchedule: this.reinstatementSchedule,
      reinstatementContractOwner: this.reinstatementContractOwner,
      operationsFirstYear: this.operationsFirstYear,
      name: this.name,
      developmentPlan: {
        developer: this.developer,
        features: {
          spacesDistribution: this.spacesDistribution,
          buildingsFloorAreaDistribution: this.buildingsFloorAreaDistribution,
        },
        installationSchedule: this.installationSchedule,
        type: this.developmentType,
        costs: this.installationCosts,
      },
    });
  }
}
