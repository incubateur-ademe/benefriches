import {
  AvoidedCO2EqWithEnRMonetaryImpact,
  getAnnualizedCO2MonetaryValueForDuration,
  sumListWithKey,
} from "shared";

import { PhotovoltaicPowerStationFeatures } from "../reconversionProject";
import {
  ReconversionProjectImpactsService,
  ReconversionProjectImpactsServiceProps,
} from "./ReconversionProjectImpactsService";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./renewable-energy/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./renewable-energy/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";

export type PhotovoltaicProjectImpactsServiceProps = ReconversionProjectImpactsServiceProps;

export class PhotovoltaicProjectImpactsService
  extends ReconversionProjectImpactsService
  implements ImpactsServiceInterface
{
  protected readonly developmentPlanFeatures: PhotovoltaicPowerStationFeatures;

  constructor(props: PhotovoltaicProjectImpactsServiceProps) {
    super(props);

    this.developmentPlanFeatures = this.reconversionProject
      .developmentPlanFeatures as PhotovoltaicPowerStationFeatures;
  }
  get avoidedCO2TonsWithEnergyProduction() {
    if (!this.developmentPlanFeatures.expectedAnnualProduction) {
      return undefined;
    }
    return computeAvoidedCO2TonsWithEnergyProductionImpact({
      forecastAnnualEnergyProductionMWh: this.developmentPlanFeatures.expectedAnnualProduction,
    });
  }

  get householdsPoweredByRenewableEnergy() {
    if (!this.developmentPlanFeatures.expectedAnnualProduction) {
      return undefined;
    }
    return computeHouseholdsPoweredByRenewableEnergyImpact({
      forecastRenewableEnergyAnnualProductionMWh:
        this.developmentPlanFeatures.expectedAnnualProduction,
    });
  }

  get socioEconomicList() {
    if (!this.avoidedCO2TonsWithEnergyProduction) {
      return [];
    }

    const avoidedCo2EqWithEnr = getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedCO2TonsWithEnergyProduction.forecast,
      this.operationsFirstYear,
      this.evaluationPeriodInYears,
    );

    const avoidedCo2EqWithEnrImpact: AvoidedCO2EqWithEnRMonetaryImpact = {
      amount: avoidedCo2EqWithEnr,
      impact: "avoided_co2_eq_with_enr",
      impactCategory: "environmental_monetary",
      actor: "human_society",
    };
    return [avoidedCo2EqWithEnrImpact];
  }

  override async formatImpacts() {
    const { economicBalance, environmental, social, socioeconomic } = await super.formatImpacts();
    const photovoltaicProjectSocioEconomic = [...socioeconomic.impacts, ...this.socioEconomicList];
    return {
      economicBalance: economicBalance,
      social: {
        ...social,
        householdsPoweredByRenewableEnergy: this.householdsPoweredByRenewableEnergy,
      },
      environmental: {
        ...environmental,
        avoidedCO2TonsWithEnergyProduction: this.avoidedCO2TonsWithEnergyProduction,
      },
      socioeconomic: {
        impacts: photovoltaicProjectSocioEconomic,
        total: sumListWithKey(photovoltaicProjectSocioEconomic, "amount"),
      },
    };
  }
}
