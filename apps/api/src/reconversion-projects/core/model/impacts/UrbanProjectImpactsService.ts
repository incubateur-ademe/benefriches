import { sumListWithKey } from "shared";

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
    return urbanFreshnessImpactsService.formatImpacts();
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
    return travelRelatedImpactsService.formatImpacts();
  }

  protected get roadsAndUtilitiesExpensesImpacts() {
    return formatRoadsAndUtilitiesExpensesImpacts(
      this.relatedSite.isFriche,
      this.relatedSite.surfaceArea,
      this.evaluationPeriodInYears,
    );
  }

  override async formatImpacts() {
    const localPropertyIncreaseImpacts = await this.getLocalPropertyIncreaseImpacts();
    const { economicBalance, environmental, social, socioeconomic } = await super.formatImpacts();
    const urbanProjectSocioEconomic = [
      ...socioeconomic.impacts,
      ...this.urbanFreshnessImpacts.socioeconomic,
      ...this.travelRelatedImpacts.socioeconomic,
      ...localPropertyIncreaseImpacts,
      ...this.roadsAndUtilitiesExpensesImpacts.socioeconomic,
    ];
    return {
      economicBalance: economicBalance,
      social: {
        ...social,
        avoidedVehiculeKilometers: this.travelRelatedImpacts.avoidedVehiculeKilometers,
        travelTimeSaved: this.travelRelatedImpacts.travelTimeSaved,
        avoidedTrafficAccidents: this.travelRelatedImpacts.avoidedTrafficAccidents,
      },
      environmental: {
        ...environmental,
        avoidedCarTrafficCo2EqEmissions: this.travelRelatedImpacts.avoidedCarTrafficCo2EqEmissions,
        avoidedAirConditioningCo2EqEmissions:
          this.urbanFreshnessImpacts.avoidedAirConditioningCo2EqEmissions,
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
