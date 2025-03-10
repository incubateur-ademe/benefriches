import { roundTo1Digit, SocioEconomicImpact, sumListWithKey, TaxesIncomeImpact } from "shared";

import { PhotovoltaicPowerStationFeatures } from "../reconversionProject";
import {
  ReconversionProjectImpactsService,
  ReconversionProjectImpactsServiceProps,
} from "./ReconversionProjectImpactsService";
import { ImpactsServiceInterface } from "./ReconversionProjectImpactsServiceInterface";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./renewable-energy/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./renewable-energy/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";

const TAXES_PURPOSE_KEY = "taxes";

type PhotovoltaicProjectImpactsServiceProps = ReconversionProjectImpactsServiceProps;

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

  protected get avoidedCO2TonsWithEnergyProductionMonetaryValue() {
    if (!this.avoidedCO2TonsWithEnergyProduction) {
      return undefined;
    }
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndCO2ValueEvolution(
      this.avoidedCO2TonsWithEnergyProduction,
    );
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
        amount:
          this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
            projectedTaxesAmount,
          ),
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

  protected get avoidedCo2EqEmissionsMonetaryValue(): SocioEconomicImpact[] {
    if (!this.avoidedCO2TonsWithEnergyProductionMonetaryValue) {
      return [];
    }

    return [
      {
        amount: this.avoidedCO2TonsWithEnergyProductionMonetaryValue,
        impact: "avoided_co2_eq_emissions",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          {
            amount: this.avoidedCO2TonsWithEnergyProductionMonetaryValue,
            impact: "avoided_co2_eq_with_enr",
          },
        ],
      },
    ];
  }

  override formatImpacts() {
    const { economicBalance, environmental, social, socioeconomic } = super.formatImpacts();
    const photovoltaicProjectSocioEconomic = [
      ...socioeconomic.impacts,
      ...this.taxesIncomeImpact,
      ...this.avoidedCo2EqEmissionsMonetaryValue,
    ];

    const avoidedCO2TonsWithEnergyProduction = this.avoidedCO2TonsWithEnergyProduction
      ? roundTo1Digit(this.avoidedCO2TonsWithEnergyProduction)
      : undefined;

    return {
      economicBalance: economicBalance,
      social: {
        ...social,
        householdsPoweredByRenewableEnergy: this.householdsPoweredByRenewableEnergy,
      },
      environmental: {
        ...environmental,
        avoidedCo2eqEmissions: {
          withRenewableEnergyProduction: avoidedCO2TonsWithEnergyProduction,
        },
      },
      socioeconomic: {
        impacts: photovoltaicProjectSocioEconomic,
        total: sumListWithKey(photovoltaicProjectSocioEconomic, "amount"),
      },
    };
  }
}
