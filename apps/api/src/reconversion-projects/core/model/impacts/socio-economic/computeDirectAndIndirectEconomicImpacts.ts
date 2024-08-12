import { sumListWithKey } from "src/shared-kernel/sum-list/sumList";
import { ReconversionProject } from "../../reconversionProject";

const RENT_PURPOSE_KEY = "rent";
const TAXES_PURPOSE_KEY = "taxes";

const FRICHE_COST_PURPOSES = [
  "security",
  "illegalDumpingCost",
  "accidentsCost",
  "otherSecuringCosts",
  "maintenance",
] as const;
type FricheCostPurpose = (typeof FRICHE_COST_PURPOSES)[number];

type DirectAndIndirectEconomicImpactsInput = {
  evaluationPeriodInYears: number;
  currentOwner: string;
  currentTenant?: string;
  futureSiteOwner?: string;
  yearlyCurrentCosts: { purpose: string; amount: number }[];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
  propertyTransferDutiesAmount?: number;
};

type BaseEconomicImpact = { actor: string; amount: number };
type RentalIncomeImpact = BaseEconomicImpact & {
  impact: "rental_income";
  impactCategory: "economic_direct";
};
type AvoidedFricheCostsImpact = BaseEconomicImpact & {
  impact: "avoided_friche_costs";
  impactCategory: "economic_direct";
  details: {
    amount: number;
    impact:
      | "avoided_security_costs"
      | "avoided_illegal_dumping_costs"
      | "avoided_accidents_costs"
      | "avoided_other_securing_costs"
      | "avoided_maintenance_costs";
  }[];
};

type TaxesIncomeImpact = BaseEconomicImpact & {
  impact: "taxes_income";
  impactCategory: "economic_indirect";
  actor: "community";
};
type PropertyTransferDutiesIncomeImpact = BaseEconomicImpact & {
  impact: "property_transfer_duties_income";
  impactCategory: "economic_direct";
  actor: "community";
};

export type DirectAndIndirectEconomicImpact =
  | RentalIncomeImpact
  | AvoidedFricheCostsImpact
  | TaxesIncomeImpact
  | PropertyTransferDutiesIncomeImpact;

export type SocioEconomicImpactsResult = DirectAndIndirectEconomicImpact[];

export const computeDirectAndIndirectEconomicImpacts = (
  input: DirectAndIndirectEconomicImpactsInput,
): SocioEconomicImpactsResult => {
  const impacts: SocioEconomicImpactsResult = [];

  const projectedRentCost = input.yearlyProjectedCosts.find(
    ({ purpose }) => purpose === RENT_PURPOSE_KEY,
  );
  const currentRentCost = input.yearlyCurrentCosts.find(
    ({ purpose }) => purpose === RENT_PURPOSE_KEY,
  );
  if (projectedRentCost) {
    if (input.futureSiteOwner) {
      impacts.push({
        amount: projectedRentCost.amount * input.evaluationPeriodInYears,
        actor: input.futureSiteOwner,
        impact: "rental_income",
        impactCategory: "economic_direct",
      });
    }
    if (currentRentCost) {
      impacts.push({
        amount: (projectedRentCost.amount - currentRentCost.amount) * input.evaluationPeriodInYears,
        actor: input.currentOwner,
        impact: "rental_income",
        impactCategory: "economic_direct",
      });
    }
  } else if (currentRentCost) {
    impacts.push({
      amount: -currentRentCost.amount * input.evaluationPeriodInYears,
      actor: input.currentOwner,
      impact: "rental_income",
      impactCategory: "economic_direct",
    });
  }

  const currentFricheCosts = input.yearlyCurrentCosts.filter(({ purpose }) =>
    FRICHE_COST_PURPOSES.includes(purpose as FricheCostPurpose),
  ) as { purpose: FricheCostPurpose; amount: number }[];

  if (currentFricheCosts.length) {
    const fricheCostImpactAmount = sumListWithKey(currentFricheCosts, "amount");
    impacts.push({
      amount: fricheCostImpactAmount * input.evaluationPeriodInYears,
      actor: input.currentTenant ?? input.currentOwner,
      impact: "avoided_friche_costs",
      impactCategory: "economic_direct",
      details: currentFricheCosts.map(({ amount, purpose }) => {
        const totalAmount = amount * input.evaluationPeriodInYears;
        switch (purpose) {
          case "maintenance":
            return { amount: totalAmount, impact: "avoided_maintenance_costs" };
          case "security":
            return { amount: totalAmount, impact: "avoided_security_costs" };
          case "accidentsCost":
            return { amount: totalAmount, impact: "avoided_accidents_costs" };
          case "illegalDumpingCost":
            return { amount: totalAmount, impact: "avoided_illegal_dumping_costs" };
          case "otherSecuringCosts":
            return { amount: totalAmount, impact: "avoided_other_securing_costs" };
        }
      }),
    });
  }

  const currentTaxesAmount =
    input.yearlyCurrentCosts.find(({ purpose }) => purpose === TAXES_PURPOSE_KEY)?.amount ?? 0;
  const projectedTaxesAmount =
    input.yearlyProjectedCosts.find(({ purpose }) => purpose === TAXES_PURPOSE_KEY)?.amount ?? 0;
  if (currentTaxesAmount || projectedTaxesAmount) {
    impacts.push({
      amount: (projectedTaxesAmount - currentTaxesAmount) * input.evaluationPeriodInYears,
      impact: "taxes_income",
      impactCategory: "economic_indirect",
      actor: "community",
    });
  }

  if (input.propertyTransferDutiesAmount) {
    impacts.push({
      amount: input.propertyTransferDutiesAmount,
      impact: "property_transfer_duties_income",
      actor: "community",
      impactCategory: "economic_direct",
    });
  }

  return impacts;
};
