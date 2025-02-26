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

  constructor(props: UrbanProjectImpactsServiceProps) {
    super(props);

    this.developmentPlanFeatures = this.reconversionProject
      .developmentPlanFeatures as UrbanProjectFeatures;

    this.siteCityData = props.siteCityData;
  }

  protected get urbanFreshnessImpacts() {
    const urbanFreshnessImpactsService = new UrbanFreshnessRelatedImpactsService({
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      spacesDistribution: this.developmentPlanFeatures.spacesDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: this.siteCityData.cityPopulation,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });
    return {
      socioEconomicList: urbanFreshnessImpactsService.getSocioEconomicList(),
      avoidedCo2EqEmissions: urbanFreshnessImpactsService.getAvoidedCo2EqEmissionsDetails(),
      environmental: urbanFreshnessImpactsService.getEnvironmentalImpacts(),
    };
  }

  protected get travelRelatedImpacts() {
    const travelRelatedImpactsService = new TravelRelatedImpactsService({
      buildingsFloorAreaDistribution: this.developmentPlanFeatures.buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea: this.relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: this.siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: this.siteCityData.cityPopulation,
      sumOnEvolutionPeriodService: this.sumOnEvolutionPeriodService,
    });
    return {
      socioEconomicList: travelRelatedImpactsService.getSocioEconomicList(),
      avoidedCo2EqEmissions: travelRelatedImpactsService.getAvoidedCo2EqEmissionsDetails(),
      social: travelRelatedImpactsService.getSocialImpacts(),
      environmental: travelRelatedImpactsService.getEnvironmentalImpacts(),
    };
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
      ...this.avoidedCo2EqEmissions,
      ...this.urbanFreshnessImpacts.socioEconomicList,
      ...this.travelRelatedImpacts.socioEconomicList,
      ...this.localPropertyIncreaseImpacts,
      ...this.roadsAndUtilitiesExpensesImpacts,
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
}
