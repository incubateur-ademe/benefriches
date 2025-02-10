import {
  getAnnualizedCO2MonetaryValueForDuration,
  SocioEconomicImpact,
  sumListWithKey,
  TaxesIncomeImpact,
} from "shared";

import { PhotovoltaicPowerStationFeatures } from "../reconversionProject";
import {
  ReconversionProjectImpactsService,
  ReconversionProjectImpactsServiceProps,
} from "./ReconversionProjectImpactsService";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./renewable-energy/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./renewable-energy/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";

const TAXES_PURPOSE_KEY = "taxes";

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

  protected get avoidedCO2TonsWithEnergyProduction() {
    if (!this.developmentPlanFeatures.expectedAnnualProduction) {
      return undefined;
    }
    return computeAvoidedCO2TonsWithEnergyProductionImpact({
      forecastAnnualEnergyProductionMWh: this.developmentPlanFeatures.expectedAnnualProduction,
    });
  }

  protected get householdsPoweredByRenewableEnergy() {
    if (!this.developmentPlanFeatures.expectedAnnualProduction) {
      return undefined;
    }
    return computeHouseholdsPoweredByRenewableEnergyImpact({
      forecastRenewableEnergyAnnualProductionMWh:
        this.developmentPlanFeatures.expectedAnnualProduction,
    });
  }

  protected get taxesIncomeImpact() {
    const impacts: TaxesIncomeImpact[] = [];

    const projectedTaxesAmount =
      this.reconversionProject.yearlyProjectedExpenses.find(
        ({ purpose }) => purpose === TAXES_PURPOSE_KEY,
      )?.amount ?? 0;

    if (projectedTaxesAmount) {
      const photovoltaicTaxesIncome: TaxesIncomeImpact["details"][number] = {
        amount: projectedTaxesAmount * this.evaluationPeriodInYears,
        impact: "project_photovoltaic_taxes_income",
      };
      impacts.push({
        amount: photovoltaicTaxesIncome.amount,
        impact: "taxes_income",
        impactCategory: "economic_indirect",
        actor: "community",
        details: [photovoltaicTaxesIncome],
      });
    }
    return impacts;
  }

  protected get avoidedCo2EqEmissions(): SocioEconomicImpact[] {
    if (!this.avoidedCO2TonsWithEnergyProduction) {
      return [];
    }

    const avoidedCo2EqWithEnr = getAnnualizedCO2MonetaryValueForDuration(
      this.avoidedCO2TonsWithEnergyProduction.forecast,
      this.operationsFirstYear,
      this.evaluationPeriodInYears,
    );

    return [
      {
        amount: avoidedCo2EqWithEnr,
        impact: "avoided_co2_eq_emissions",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          {
            amount: avoidedCo2EqWithEnr,
            impact: "avoided_co2_eq_with_enr",
          },
        ],
      },
    ];
  }

  override async formatImpacts() {
    const { economicBalance, environmental, social, socioeconomic } = await super.formatImpacts();
    const photovoltaicProjectSocioEconomic = [
      ...socioeconomic.impacts,
      ...this.taxesIncomeImpact,
      ...this.avoidedCo2EqEmissions,
    ];

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
