import {
  AvoidedCO2EqEmissions,
  computeEstimatedPropertyTaxesAmount,
  SocioEconomicImpact,
  sumListWithKey,
  TaxesIncomeImpact,
} from "shared";

import { UrbanProjectFeatures } from "../urbanProjects";
import {
  ReconversionProjectImpactsService,
  ReconversionProjectImpactsServiceProps,
} from "./ReconversionProjectImpactsService";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { computePropertyValueImpact } from "./property-value/propertyValueImpact";
import { getRoadsAndUtilitiesExpensesImpacts } from "./roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";
import { TravelRelatedImpactsService } from "./travel-related-impacts-service/TravelRelatedImpactsService";
import { UrbanFreshnessRelatedImpactsService } from "./urban-freshness-related-impacts-service/UrbanFreshnessRelatedImpactsService";

type SiteCityDataProps =
  | {
      siteIsFriche: true;
      citySquareMetersSurfaceArea: number;
      cityPopulation: number;
      cityPropertyValuePerSquareMeter: number;
    }
  | {
      siteIsFriche: false;
      citySquareMetersSurfaceArea: number;
      cityPopulation: number;
    };

type UrbanProjectImpactsServiceProps = ReconversionProjectImpactsServiceProps & {
  siteCityData: SiteCityDataProps;
};

export class UrbanProjectImpactsService
  extends ReconversionProjectImpactsService
  implements ImpactsServiceInterface
{
  protected readonly developmentPlanFeatures: UrbanProjectFeatures;
  private readonly siteCityData: SiteCityDataProps;
  private readonly travelRelatedImpactsService: TravelRelatedImpactsService;
  private readonly urbanFreshnessImpactsService: UrbanFreshnessRelatedImpactsService;

  constructor(props: UrbanProjectImpactsServiceProps) {
    super(props);

    this.developmentPlanFeatures = this.reconversionProject
      .developmentPlanFeatures as UrbanProjectFeatures;

    this.siteCityData = props.siteCityData;

    this.travelRelatedImpactsService = new TravelRelatedImpactsService({
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: this.siteCityData.cityPopulation,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });

    this.urbanFreshnessImpactsService = new UrbanFreshnessRelatedImpactsService({
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      spacesDistribution: this.developmentPlanFeatures.spacesDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: this.siteCityData.cityPopulation,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });
  }

  protected get roadsAndUtilitiesExpensesImpacts(): SocioEconomicImpact[] {
    const amount = getRoadsAndUtilitiesExpensesImpacts({
      isFriche: this.relatedSite.isFriche,
      surfaceArea: this.relatedSite.surfaceArea,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });
    if (amount) {
      return [
        {
          impact: "roads_and_utilities_maintenance_expenses",
          amount: amount,
          actor: "community",
          impactCategory: "economic_direct",
        },
      ];
    }
    return [];
  }

  protected get taxesIncomeImpact(): TaxesIncomeImpact[] {
    const impacts: TaxesIncomeImpact[] = [];
    const details: TaxesIncomeImpact["details"] = [];

    const newHousesSurfaceArea =
      this.developmentPlanFeatures.buildingsFloorAreaDistribution.RESIDENTIAL ?? 0;

    if (newHousesSurfaceArea > 0) {
      details.push({
        amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
          computeEstimatedPropertyTaxesAmount(newHousesSurfaceArea),
        ),
        impact: "project_new_houses_taxes_income",
      });
    }

    const newCompanySurfaceArea =
      this.developmentPlanFeatures.buildingsFloorAreaDistribution.OFFICES ?? 0;

    if (newCompanySurfaceArea > 0) {
      details.push({
        amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
          (2018 * newCompanySurfaceArea) / 15,
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

  protected get avoidedCo2EqEmissionsMonetaryValue(): SocioEconomicImpact[] {
    const details: AvoidedCO2EqEmissions["details"] = [];

    const avoidedUrbanFreshnessCo2EqEmissions =
      this.urbanFreshnessImpactsService.getAvoidedAirConditioningCo2Emissions();
    const avoidedTrafficCo2EqEmissions =
      this.travelRelatedImpactsService.getAvoidedTrafficCO2Emissions();

    if (avoidedTrafficCo2EqEmissions) {
      details.push({
        amount: avoidedTrafficCo2EqEmissions.monetaryValue,
        impact: "avoided_traffic_co2_eq_emissions",
      });
    }

    if (avoidedUrbanFreshnessCo2EqEmissions) {
      details.push({
        amount: avoidedUrbanFreshnessCo2EqEmissions.monetaryValue,
        impact: "avoided_air_conditioning_co2_eq_emissions",
      });
    }

    if (details.length === 0) {
      return [];
    }

    return [
      {
        amount: sumListWithKey(details, "amount"),
        impact: "avoided_co2_eq_emissions",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: details,
      },
    ];
  }

  private get localPropertyIncreaseImpacts(): SocioEconomicImpact[] {
    if (!this.siteCityData.siteIsFriche) {
      return [];
    }

    const { propertyValueIncrease, propertyTransferDutiesIncrease } = computePropertyValueImpact(
      this.relatedSite.surfaceArea,
      this.siteCityData.citySquareMetersSurfaceArea,
      this.siteCityData.cityPopulation,
      this.siteCityData.cityPropertyValuePerSquareMeter,
      this.sumOnEvolutionPeriodService,
      false, // TODO: quartier V2 créer une méthode de calcul pour ce paramètre
    );
    return [
      {
        actor: "local_people",
        amount: propertyValueIncrease,
        impact: "local_property_value_increase",
        impactCategory: "economic_indirect",
      },
      {
        actor: "community",
        amount: propertyTransferDutiesIncrease,
        impact: "local_transfer_duties_increase",
        impactCategory: "economic_indirect",
      },
    ];
  }

  override formatImpacts() {
    const { economicBalance, environmental, social, socioeconomic } = super.formatImpacts();
    const urbanProjectSocioEconomic = [
      ...socioeconomic.impacts,
      ...this.taxesIncomeImpact,
      ...this.avoidedCo2EqEmissionsMonetaryValue,
      ...this.urbanFreshnessImpactsService.getSocioEconomicList(),
      ...this.travelRelatedImpactsService.getSocioEconomicList(),
      ...this.localPropertyIncreaseImpacts,
      ...this.roadsAndUtilitiesExpensesImpacts,
    ];

    return {
      economicBalance: economicBalance,
      social: {
        ...social,
        avoidedVehiculeKilometers:
          this.travelRelatedImpactsService.getAvoidedKilometersPerVehicule(),
        travelTimeSaved: this.travelRelatedImpactsService.getTravelTimeSavedPerTraveler(),
        avoidedTrafficAccidents: this.travelRelatedImpactsService.getAvoidedTrafficAccidents(),
      },
      environmental: {
        ...environmental,
        avoidedCo2eqEmissions: {
          withCarTrafficDiminution:
            this.travelRelatedImpactsService.getAvoidedTrafficCO2Emissions()?.inTons,
          withAirConditioningDiminution:
            this.urbanFreshnessImpactsService.getAvoidedAirConditioningCo2Emissions()?.inTons,
        },
      },
      socioeconomic: {
        impacts: urbanProjectSocioEconomic,
        total: sumListWithKey(urbanProjectSocioEconomic, "amount"),
      },
    };
  }
}
