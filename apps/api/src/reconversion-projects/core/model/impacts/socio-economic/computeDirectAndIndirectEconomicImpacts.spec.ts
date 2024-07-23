import {
  computeDirectAndIndirectEconomicImpacts,
  type SocioEconomicImpactsResult,
} from "./computeDirectAndIndirectEconomicImpacts";

describe("Socio-economic impacts", () => {
  describe("Rental income", () => {
    it("returns no impact when no current or future rental income", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([]);
    });
    it("returns rental income impact over 10 years for future site owner when the site is not currently rented but will be", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        futureSiteOwner: "Mairie de Paris",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [{ amount: 30000, purpose: "rent" }],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "Mairie de Paris",
          amount: 300000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });

    it("returns rental income negative impact over 10 years for current site owner when the site is rented but won't be anymore", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [{ amount: 20000, purpose: "rent" }],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "Current owner",
          amount: -200000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });
    it("returns cumulated rental income positive impact over 10 years for site owner when the site is currently rented and will be rented for a higher rent", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [{ amount: 5000, purpose: "rent" }],
        yearlyProjectedCosts: [{ amount: 10000, purpose: "rent" }],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "Current owner",
          amount: 50000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });

    it("returns rental income impact over 10 years for site owner and future site owner when the site is currently rented and will be but owner will change", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        futureSiteOwner: "New owner",
        yearlyCurrentCosts: [{ amount: 5000, purpose: "rent" }],
        yearlyProjectedCosts: [{ amount: 10000, purpose: "rent" }],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "New owner",
          amount: 100000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          actor: "Current owner",
          amount: 50000,
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
      ]);
    });
  });

  describe("Avoided friche costs", () => {
    it("returns no impact when no current friche costs", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([]);
    });

    it("returns avoided friche costs for current tenant over 10 years when friche costs", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        currentTenant: "Current tenant",
        yearlyCurrentCosts: [
          {
            amount: 14000,
            purpose: "security",
          },
          {
            amount: 1000,
            purpose: "maintenance",
          },
          {
            amount: 1500,
            purpose: "illegalDumpingCost",
          },
          {
            amount: 1500,
            purpose: "accidentsCost",
          },
          {
            amount: 5000,
            purpose: "otherSecuringCosts",
          },
          {
            amount: 500000000,
            purpose: "non-relevant-cost",
          },
        ],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "Current tenant",
          amount: 230000,
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
        },
      ]);
    });

    it("returns avoided friche costs for current owner over 10 years when friche costs but no tenant", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        currentTenant: undefined,
        yearlyCurrentCosts: [
          {
            amount: 14000,
            purpose: "security",
          },
          {
            amount: 1500,
            purpose: "illegalDumpingCost",
          },
          {
            amount: 500000000,
            purpose: "non-relevant-cost",
          },
        ],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "Current owner",
          amount: 155000,
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
        },
      ]);
    });
  });

  describe("Taxes income", () => {
    it("returns no impact when no current taxes costs", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([]);
    });

    it("returns taxes income impact as difference between projected and current taxes amounts", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [{ amount: 12000, purpose: "taxes" }],
        yearlyProjectedCosts: [{ amount: 20000, purpose: "taxes" }],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "community",
          amount: 80000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });

    it("returns taxes income impact when only current taxes amount provided", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [{ amount: 12000, purpose: "taxes" }],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "community",
          amount: -120000,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });

    it("returns taxes income impact when only projected taxes amount provided", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [{ amount: 1234, purpose: "taxes" }],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "community",
          amount: 12340,
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
      ]);
    });
  });

  describe("Property transfer duties income", () => {
    it("returns no impact when no property transfer duties", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [],
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([]);
    });

    it("returns property transfer duties income impact for community", () => {
      const result = computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: 10,
        currentOwner: "Current owner",
        currentTenant: "Current tenant",
        yearlyCurrentCosts: [],
        yearlyProjectedCosts: [],
        propertyTransferDutiesAmount: 5000,
      });
      expect(result).toEqual<SocioEconomicImpactsResult>([
        {
          actor: "community",
          amount: 5000,
          impact: "property_transfer_duties_income",
          impactCategory: "economic_direct",
        },
      ]);
    });
  });
});
