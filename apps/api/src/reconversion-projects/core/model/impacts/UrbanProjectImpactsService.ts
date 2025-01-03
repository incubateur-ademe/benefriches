import {
  AvoidedCO2EqEmissions,
  roundToInteger,
  SocioEconomicImpact,
  sumListWithKey,
  TaxesIncomeImpact,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { UrbanProjectFeatures } from "../urbanProjects";
import {
  ReconversionProjectImpactsService,
  ReconversionProjectImpactsServiceProps,
} from "./ReconversionProjectImpactsService";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { getLocalPropertyValueIncreaseRelatedImpacts } from "./property-value/propertyValueImpact";
import { formatRoadsAndUtilitiesExpensesImpacts } from "./roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";
import { TravelRelatedImpactsService } from "./travel-related-impacts-service/TravelRelatedImpactsService";
import { UrbanFreshnessRelatedImpactsService } from "./urban-freshness-related-impacts-service/UrbanFreshnessRelatedImpactsService";

export type UrbanProjectImpactsServiceProps = ReconversionProjectImpactsServiceProps & {
  getCityRelatedDataService: GetCityRelatedDataService;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
};

export class UrbanProjectImpactsService
  extends ReconversionProjectImpactsService
  implements ImpactsServiceInterface
{
  protected readonly developmentPlanFeatures: UrbanProjectFeatures;
  private readonly citySquareMetersSurfaceArea: number;
  private readonly cityPopulation: number;

  private readonly getCityRelatedDataService: GetCityRelatedDataService;

  constructor(props: UrbanProjectImpactsServiceProps) {
    super(props);

    this.developmentPlanFeatures = this.reconversionProject
      .developmentPlanFeatures as UrbanProjectFeatures;
    this.getCityRelatedDataService = props.getCityRelatedDataService;

    this.citySquareMetersSurfaceArea = props.citySquareMetersSurfaceArea;
    this.cityPopulation = props.cityPopulation;
  }

  protected get urbanFreshnessImpacts() {
    const urbanFreshnessImpactsService = new UrbanFreshnessRelatedImpactsService({
      evaluationPeriodInYears: this.evaluationPeriodInYears,
      operationsFirstYear: this.operationsFirstYear,
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      spacesDistribution: this.developmentPlanFeatures.spacesDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.citySquareMetersSurfaceArea,
      cityPopulation: this.cityPopulation,
    });
    return {
      socioEconomicList: urbanFreshnessImpactsService.getSocioEconomicList(),
      avoidedCo2EqEmissions: urbanFreshnessImpactsService.getAvoidedCo2EqEmissionsDetails(),
      environmental: urbanFreshnessImpactsService.getEnvironmentalImpacts(),
    };
  }

  protected get travelRelatedImpacts() {
    const travelRelatedImpactsService = new TravelRelatedImpactsService({
      evaluationPeriodInYears: this.evaluationPeriodInYears,
      operationsFirstYear: this.operationsFirstYear,
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.citySquareMetersSurfaceArea,
      cityPopulation: this.cityPopulation,
    });
    return {
      socioEconomicList: travelRelatedImpactsService.getSocioEconomicList(),
      avoidedCo2EqEmissions: travelRelatedImpactsService.getAvoidedCo2EqEmissionsDetails(),
      social: travelRelatedImpactsService.getSocialImpacts(),
      environmental: travelRelatedImpactsService.getEnvironmentalImpacts(),
    };
  }

  protected get roadsAndUtilitiesExpensesImpacts() {
    return formatRoadsAndUtilitiesExpensesImpacts(
      this.relatedSite.isFriche,
      this.relatedSite.surfaceArea,
      this.evaluationPeriodInYears,
    );
  }

  protected get taxesIncomeImpact(): TaxesIncomeImpact[] {
    const impacts: TaxesIncomeImpact[] = [];
    const details: TaxesIncomeImpact["details"] = [];

    const newHousesSurfaceArea =
      this.developmentPlanFeatures.buildingsFloorAreaDistribution.RESIDENTIAL ?? 0;

    if (newHousesSurfaceArea > 0) {
      details.push({
        amount: roundToInteger(newHousesSurfaceArea * 11 * this.evaluationPeriodInYears),
        impact: "project_new_houses_taxes_income",
      });
    }

    const newCompanySurfaceArea =
      this.developmentPlanFeatures.buildingsFloorAreaDistribution.TERTIARY_ACTIVITIES ?? 0;

    if (newCompanySurfaceArea > 0) {
      details.push({
        amount: roundToInteger(
          ((2018 * newCompanySurfaceArea) / 15) * this.evaluationPeriodInYears,
        ),
        impact: "project_new_company_taxation_income",
      });
    }

    if (details.length !== 0) {
      impacts.push({
        impact: "taxes_income",
        actor: "community",
        impactCategory: "economic_indirect",
        amount: sumListWithKey(details, "amount"),
        details,
      });
    }

    return impacts;
  }

  protected get avoidedCo2EqEmissions(): SocioEconomicImpact[] {
    const avoidedUrbanFreshnessCo2EqEmissions = this.urbanFreshnessImpacts.avoidedCo2EqEmissions;
    const avoidedTrafficCo2EqEmissions = this.travelRelatedImpacts.avoidedCo2EqEmissions;

    const details: AvoidedCO2EqEmissions["details"] = [
      ...avoidedUrbanFreshnessCo2EqEmissions,
      ...avoidedTrafficCo2EqEmissions,
    ].filter(({ amount }) => amount > 0);

    const total = sumListWithKey(details, "amount");

    if (total > 0) {
      return [
        {
          amount: total,
          impact: "avoided_co2_eq_emissions",
          impactCategory: "environmental_monetary",
          actor: "human_society",
          details: details,
        },
      ];
    }
    return [];
  }

  override async formatImpacts() {
    const localPropertyIncreaseImpacts = await this.getLocalPropertyIncreaseImpacts();
    const { economicBalance, environmental, social, socioeconomic } = await super.formatImpacts();
    const urbanProjectSocioEconomic = [
      ...socioeconomic.impacts,
      ...this.taxesIncomeImpact,
      ...this.avoidedCo2EqEmissions,
      ...this.urbanFreshnessImpacts.socioEconomicList,
      ...this.travelRelatedImpacts.socioEconomicList,
      ...localPropertyIncreaseImpacts,
      ...this.roadsAndUtilitiesExpensesImpacts.socioeconomic,
    ];
    return {
      economicBalance: economicBalance,
      social: {
        ...social,
        ...this.travelRelatedImpacts.social,
      },
      environmental: {
        ...environmental,
        ...this.travelRelatedImpacts.environmental,
        ...this.urbanFreshnessImpacts.environmental,
      },
      socioeconomic: {
        impacts: urbanProjectSocioEconomic,
        total: sumListWithKey(urbanProjectSocioEconomic, "amount"),
      },
    };
  }

  private async getLocalPropertyIncreaseImpacts() {
    return await getLocalPropertyValueIncreaseRelatedImpacts({
      evaluationPeriodInYears: this.evaluationPeriodInYears,
      siteSurfaceArea: this.relatedSite.surfaceArea,
      siteIsFriche: this.relatedSite.isFriche,
      siteCityCode: this.relatedSite.addressCityCode,
      citySurfaceArea: this.citySquareMetersSurfaceArea,
      cityPopulation: this.cityPopulation,
      getCityRelatedDataService: this.getCityRelatedDataService,
    });
  }
}
