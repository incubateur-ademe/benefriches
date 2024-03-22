import {
  getNegativeSocioEconomicImpacts,
  getPositiveSocioEconomicImpacts,
  sumSocioEconomicImpactsByActor,
  sumSocioEconomicImpactsByCategory,
} from "./socioEconomicImpacts";

describe("SocioEconomicImpacts helpers", () => {
  describe("sumSocioEconomicImpactsByCategory", () => {
    it("returns empty Map when no impacts", () => {
      const result = sumSocioEconomicImpactsByCategory([]);
      expect(result).toEqual(new Map());
    });

    it("returns impacts summed by category", () => {
      const result = sumSocioEconomicImpactsByCategory([
        {
          amount: -1000,
          actor: "Current owner",
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          amount: 4000,
          actor: "Future owner",
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          amount: 1000,
          actor: "community",
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
        {
          amount: 400,
          actor: "community",
          impact: "property_transfer_duties_income",
          impactCategory: "economic_indirect",
        },
        {
          amount: 5000,
          actor: "Bénéfriches core team",
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
        },
      ]);
      expect(result).toEqual(
        new Map([
          ["economic_direct", 8000],
          ["economic_indirect", 1400],
        ]),
      );
    });
  });

  describe("sumSocioEconomicImpactsByActor", () => {
    it("returns empty Map when no impacts", () => {
      const result = sumSocioEconomicImpactsByActor([]);
      expect(result).toEqual(new Map());
    });

    it("returns impacts summed by actor", () => {
      const result = sumSocioEconomicImpactsByActor([
        {
          amount: -2000,
          actor: "Current owner",
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          amount: 4000,
          actor: "Future owner",
          impact: "rental_income",
          impactCategory: "economic_direct",
        },
        {
          amount: 1000,
          actor: "community",
          impact: "taxes_income",
          impactCategory: "economic_indirect",
        },
        {
          amount: 5000,
          actor: "Current owner",
          impact: "avoided_friche_costs",
          impactCategory: "economic_direct",
        },
        {
          amount: 567,
          actor: "community",
          impact: "property_transfer_duties_income",
          impactCategory: "economic_indirect",
        },
      ]);
      expect(result).toEqual(
        new Map([
          ["Future owner", 4000],
          ["Current owner", 3000],
          ["community", 1567],
        ]),
      );
    });
  });

  describe("getPositiveSocioEconomicImpacts", () => {
    it("returns only positive amounts", () => {
      const result = getPositiveSocioEconomicImpacts(
        new Map([
          ["economic_direct", 1000],
          ["economic_indirect", -300],
        ]),
      );
      expect(result).toEqual(new Map([["economic_direct", 1000]]));
    });
  });

  describe("getNegativeSocioEconomicImpacts", () => {
    it("returns only negative amounts", () => {
      const result = getNegativeSocioEconomicImpacts(
        new Map([
          ["economic_direct", 1000],
          ["economic_indirect", -300],
        ]),
      );
      expect(result).toEqual(new Map([["economic_indirect", -300]]));
    });
  });
});
