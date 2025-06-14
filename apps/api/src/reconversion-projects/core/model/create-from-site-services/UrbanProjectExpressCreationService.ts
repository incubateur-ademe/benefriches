import {
  BuildingsUseDistribution,
  computeDefaultInstallationExpensesFromSiteSurfaceArea,
  computeDefaultInstallationSchedule,
  computeDefaultOperationsFirstYear,
  computeDefaultReinstatementSchedule,
  computeDefaultSitePurchaseFromSiteSurfaceArea,
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces,
  computeProjectReinstatementExpenses,
  computePropertyTransferDutiesFromSellingPrice,
  computeSoilsDistributionFromSpaces,
  formatMunicipalityName,
  ReinstatementExpensePurpose,
  SiteNature,
  SoilsDistribution,
  LEGACY_SpacesDistribution,
  typedObjectEntries,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { ReconversionProject, reconversionProjectSchema } from "../reconversionProject";

type SiteData = {
  id: string;
  nature: SiteNature;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: {
    city: string;
  };
  owner: {
    structureType: string;
    name?: string;
  };
};

function willProjectIncludeReinstatement(siteData: SiteData) {
  return siteData.nature === "FRICHE";
}

export class UrbanProjectExpressCreationService {
  name;
  developmentType;

  constructor(
    private readonly dateProvider: DateProvider,
    private readonly reconversionProjectId: string,
    private readonly createdBy: string,
    readonly siteData: SiteData,
  ) {
    this.name = "";
    this.developmentType = "URBAN_PROJECT" as const;
  }

  get spacesDistribution(): LEGACY_SpacesDistribution {
    return {};
  }

  get buildingsFloorAreaDistribution(): BuildingsUseDistribution {
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
    if (willProjectIncludeReinstatement(this.siteData)) {
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
      computeDefaultInstallationExpensesFromSiteSurfaceArea(this.siteData.surfaceArea);
    return [
      { amount: technicalStudies, purpose: "technical_studies" },
      { amount: developmentWorks, purpose: "development_works" },
      { amount: other, purpose: "other" },
    ];
  }

  get reinstatementCosts() {
    if (!willProjectIncludeReinstatement(this.siteData)) {
      return undefined;
    }
    return typedObjectEntries(
      computeProjectReinstatementExpenses(
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
    if (willProjectIncludeReinstatement(this.siteData)) {
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

  get operationsFirstYear() {
    return computeDefaultOperationsFirstYear(this.installationSchedule.endDate);
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
