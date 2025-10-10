import { IDateProvider } from "../../../adapters/IDateProvider";
import { typedObjectEntries } from "../../../object-entries";
import { SoilsDistribution } from "../../../soils";
import { DefaultProjectGenerator } from "../../_common/project-generator/DefaultProjectGenerator";
import { ReconversionProject, SiteData } from "../../_common/project-generator/types";
import { saveReconversionProjectSchema } from "../../reconversionProjectSchemas";
import { computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower } from "../installationExpenses";
import {
  computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower,
  RecurringExpense,
} from "../recurringExpenses";
import { computeDefaultPhotovoltaicYearlyRecurringRevenueAmount } from "../recurringRevenue";
import {
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  preserveCurrentSoils,
  transformNonSuitableSoils,
} from "../soilsTransformation";
import {
  AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
  getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea,
} from "../surfaceAreas";

type PerformanceParams = {
  lat: number;
  long: number;
  peakPower: number;
};

type PerformanceResult = {
  expectedPerformance: {
    kwhPerDay: number;
    kwhPerMonth: number;
    kwhPerYear: number;
  };
};

interface PhotovoltaicDataProvider {
  getPhotovoltaicPerformance(params: PerformanceParams): Promise<PerformanceResult>;
}

type UserData = {
  structureType?: string;
  structureName?: string;
  id: string;
};

type Props = {
  dateProvider: IDateProvider;
  photovoltaicPerformanceService: PhotovoltaicDataProvider;
  reconversionProjectId: string;
  siteData: SiteData & { address: { lat: number; long: number } };
  userData: UserData;
};

export class PhotovoltaicPowerPlantProjectGenerator extends DefaultProjectGenerator {
  name;
  developmentType;
  readonly futureSiteOwner = undefined;
  readonly reconversionProjectId;
  readonly userData;
  override readonly siteData;
  readonly photovoltaicPerformanceService: PhotovoltaicDataProvider;

  constructor({
    dateProvider,
    photovoltaicPerformanceService,
    reconversionProjectId,
    siteData,
    userData,
  }: Props) {
    super(dateProvider, siteData);
    this.photovoltaicPerformanceService = photovoltaicPerformanceService;
    this.reconversionProjectId = reconversionProjectId;
    this.userData = userData;
    this.siteData = siteData;
    this.name = "Centrale photovoltaïque";
    this.developmentType = "PHOTOVOLTAIC_POWER_PLANT" as const;
  }

  get nonSuitableSoilsForPhotovoltaicPanels(): SoilsDistribution {
    return getNonSuitableSoilsForPhotovoltaicPanels(this.siteData.soilsDistribution);
  }

  get suitableSurfaceAreaForPhotovoltaicPanels() {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(this.siteData.soilsDistribution);
  }

  get soilsDistributionForTransformation() {
    const missingSuitableSurface =
      this.featuresSurfaceArea - this.suitableSurfaceAreaForPhotovoltaicPanels;
    if (missingSuitableSurface > 0) {
      // Les panneaux occupent la totalité de la surface du site
      return transformNonSuitableSoils(
        this.siteData.soilsDistribution,
        this.nonSuitableSoilsForPhotovoltaicPanels,
      );
    }
    return this.siteData.soilsDistribution;
  }

  override get projectSoilsDistributionByType() {
    const recommendedImpermeableSurfaceArea =
      getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea(this.featuresElectricalPowerKWc);
    const recommendedMineralSurfaceArea = getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea(
      this.featuresElectricalPowerKWc,
    );
    return preserveCurrentSoils(this.soilsDistributionForTransformation, {
      recommendedImpermeableSurfaceArea,
      recommendedMineralSurfaceArea,
    });
  }

  override get projectSoilsDistribution() {
    return typedObjectEntries(this.projectSoilsDistributionByType).map(
      ([soilType, surfaceArea = 0]) => ({
        surfaceArea,
        soilType,
      }),
      [],
    );
  }

  override get developer() {
    if (this.userData.structureType) {
      return {
        name: this.userData.structureName,
        structureType: this.userData.structureType,
      };
    }
    return {
      name: this.siteData.owner.name ?? "Propriétaire du site",
      structureType: this.siteData.owner.structureType,
    };
  }

  get futureSiteOperator() {
    return this.developer;
  }

  get installationCosts() {
    const { technicalStudy, works, other } =
      computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower(
        this.featuresElectricalPowerKWc,
      );
    return [
      { amount: technicalStudy, purpose: "technical_studies" },
      { amount: works, purpose: "installation_works" },
      { amount: other, purpose: "other" },
    ];
  }

  get featuresSurfaceArea() {
    return this.siteData.surfaceArea;
  }

  get featuresElectricalPowerKWc() {
    return getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(this.featuresSurfaceArea);
  }

  get featuresContractDuration() {
    return AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS;
  }

  get yearlyProjectedCosts(): RecurringExpense[] {
    const { rent, maintenance, taxes, other } =
      computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower(
        this.featuresElectricalPowerKWc,
      );
    return [
      { amount: rent, purpose: "rent" },
      { amount: maintenance, purpose: "maintenance" },
      { amount: taxes, purpose: "taxes" },
      { amount: other, purpose: "other" },
    ];
  }

  async getExpectedYearlyMWhPerformance(): Promise<number> {
    try {
      const { expectedPerformance } =
        await this.photovoltaicPerformanceService.getPhotovoltaicPerformance({
          lat: this.siteData.address.lat,
          long: this.siteData.address.long,
          peakPower: this.featuresElectricalPowerKWc,
        });
      return Math.round(expectedPerformance.kwhPerYear / 1000);
    } catch (err) {
      console.error("Fail to compute expectedAnnualProduction for PV express project", err);
      // on utilise une valeur moyenne par defaut : 1 kWc = 1 200 kWh/an
      return Math.round((1200 * this.featuresElectricalPowerKWc) / 1000);
    }
  }

  async getReconversionProject(): Promise<ReconversionProject> {
    const featuresExpectedAnnualProduction = await this.getExpectedYearlyMWhPerformance();
    const yearlyProjectProductionRevenue = computeDefaultPhotovoltaicYearlyRecurringRevenueAmount(
      featuresExpectedAnnualProduction,
    );

    return saveReconversionProjectSchema.parse({
      id: this.reconversionProjectId,
      createdBy: this.userData.id,
      createdAt: this.dateProvider.now(),
      creationMode: "express",
      projectPhase: "setup",
      soilsDistribution: this.projectSoilsDistribution,
      decontaminatedSoilSurface: this.decontaminatedSoilSurface,
      yearlyProjectedCosts: this.yearlyProjectedCosts,
      yearlyProjectedRevenues: [{ amount: yearlyProjectProductionRevenue, source: "operations" }],
      relatedSiteId: this.siteData.id,
      futureSiteOwner: this.futureSiteOwner,
      futureOperator: this.futureSiteOperator,
      reinstatementCosts: this.reinstatementCosts,
      reinstatementSchedule: this.reinstatementSchedule,
      reinstatementContractOwner: this.reinstatementContractOwner,
      operationsFirstYear: this.operationsFirstYear,
      name: this.name,
      developmentPlan: {
        developer: this.developer,
        features: {
          surfaceArea: this.featuresSurfaceArea,
          electricalPowerKWc: this.featuresElectricalPowerKWc,
          expectedAnnualProduction: featuresExpectedAnnualProduction,
          contractDuration: this.featuresContractDuration,
        },
        installationSchedule: this.installationSchedule,
        type: this.developmentType,
        costs: this.installationCosts,
      },
    });
  }
}
