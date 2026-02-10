import { IDateProvider } from "../../../adapters/IDateProvider";
import { computePropertyTransferDutiesFromSellingPrice } from "../../../financial";
import { formatMunicipalityName } from "../../../local-authority";
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

  get buildingsFloorAreaDistribution(): BuildingsUseDistribution {
    return {};
  }

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [];
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
      status: "active",
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
          buildingsFloorAreaDistribution: this.buildingsFloorAreaDistribution,
        },
        installationSchedule: this.installationSchedule,
        type: this.developmentType,
        costs: this.installationCosts,
      },
    });
  }
}
