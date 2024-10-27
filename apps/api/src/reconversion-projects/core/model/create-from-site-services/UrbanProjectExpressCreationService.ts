import {
  BuildingFloorAreaUsageDistribution,
  computeDefaultInstallationCostsFromSiteSurfaceArea,
  computeDefaultInstallationSchedule,
  computeDefaultOperationsFirstYear,
  computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution,
  computeDefaultReinstatementSchedule,
  computeDefaultSitePurchaseFromSiteSurfaceArea,
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces,
  computeProjectReinstatementCosts,
  computePropertyTransferDutiesFromSellingPrice,
  computeReinstatementFullTimeJobs,
  computeSoilsDistributionFromSpaces,
  formatMunicipalityName,
  ReinstatementExpensePurpose,
  SoilsDistribution,
  SpacesDistribution,
  typedObjectEntries,
} from "shared";

import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { Address } from "src/sites/core/models/site";

import { ReconversionProject, reconversionProjectSchema } from "../reconversionProject";

export type SiteData = {
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

export class UrbanProjectExpressCreationService {
  name;
  developmentType;

  constructor(
    private readonly dateProvider: IDateProvider,
    private readonly reconversionProjectId: string,
    private readonly createdBy: string,
    readonly siteData: SiteData,
  ) {
    this.name = "";
    this.developmentType = "URBAN_PROJECT" as const;
  }

  get spacesDistribution(): SpacesDistribution {
    return {};
  }

  get buildingsFloorAreaDistribution(): BuildingFloorAreaUsageDistribution {
    return {};
  }

  get projectSoilsDistribution() {
    return computeSoilsDistributionFromSpaces(this.spacesDistribution);
  }

  get developer() {
    return {
      name: formatMunicipalityName(this.siteData.address.city),
      structureType: "municipality",
    };
  }

  get reinstatementContractOwner() {
    if (this.siteData.isFriche) {
      return this.developer;
    }
    return undefined;
  }

  // spaces and soils
  get decontaminatedSoilSurface() {
    return 0.75 * (this.siteData.contaminatedSoilSurface ?? 0);
  }

  // expenses and incomes
  get installationCosts() {
    const { technicalStudies, developmentWorks, other } =
      computeDefaultInstallationCostsFromSiteSurfaceArea(this.siteData.surfaceArea);
    return [
      { amount: technicalStudies, purpose: "technical_studies" },
      { amount: developmentWorks, purpose: "development_works" },
      { amount: other, purpose: "other" },
    ];
  }

  get reinstatementCosts() {
    if (!this.siteData.isFriche) {
      return undefined;
    }
    return typedObjectEntries(
      computeProjectReinstatementCosts(
        this.siteData.soilsDistribution,
        this.projectSoilsDistribution,
        this.decontaminatedSoilSurface,
      ),
    )
      .filter(([, amount]) => amount && amount > 0)
      .map(([purpose, amount]) => {
        switch (purpose) {
          case "deimpermeabilization":
          case "remediation":
          case "demolition":
            return { amount, purpose };
          case "sustainableSoilsReinstatement":
            return { amount, purpose: "sustainable_soils_reinstatement" };
          case "asbestosRemoval":
            return { amount, purpose: "asbestos_removal" };
        }
      }) as { amount: number; purpose: ReinstatementExpensePurpose }[];
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

  // schedules
  get reinstatementSchedule() {
    if (this.siteData.isFriche) {
      return computeDefaultReinstatementSchedule(this.dateProvider);
    }
    return undefined;
  }

  get installationSchedule() {
    return computeDefaultInstallationSchedule(this.dateProvider)(
      this.reinstatementSchedule?.endDate,
    );
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

  get reinstatementFullTimeJobsInvolved() {
    if (this.siteData.isFriche) {
      return computeReinstatementFullTimeJobs(this.reinstatementCosts);
    }
    return undefined;
  }

  get operationsFirstYear() {
    return computeDefaultOperationsFirstYear(this.installationSchedule.endDate);
  }

  get operationsFullTimeJobsInvolved() {
    return computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution(
      this.buildingsFloorAreaDistribution,
    );
  }

  getReconversionProject(): ReconversionProject {
    return reconversionProjectSchema.parse({
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
      reinstatementFullTimeJobsInvolved: this.reinstatementFullTimeJobsInvolved,
      reinstatementContractOwner: this.reinstatementContractOwner,
      operationsFirstYear: this.operationsFirstYear,
      operationsFullTimeJobsInvolved: this.operationsFullTimeJobsInvolved,
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
