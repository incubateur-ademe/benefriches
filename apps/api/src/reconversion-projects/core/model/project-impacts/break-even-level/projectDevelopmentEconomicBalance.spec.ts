import { describe, it, expect } from "vitest";

import {
  getProjectDevelopmentEconomicBalance,
  InputProjectDevelopmentEconomicBalanceProps,
} from "./projectDevelopmentEconomicBalance";

const baseProps: InputProjectDevelopmentEconomicBalanceProps = {
  stakeholders: {
    current: {
      owner: { structureType: "company", structureName: "Promo SA" },
    },
    project: {
      developer: { structureType: "company", structureName: "Promo SA" },
      reinstatementContractOwner: { structureType: "company", structureName: "Promo SA" },
    },
    future: {},
  },
  revenues: {
    financialAssistanceRevenues: [],
  },
  costs: {
    reinstatementCosts: [],
    developmentPlanInstallationCosts: [],
  },
  developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT" as const,
};

describe("getProjectDevelopmentEconomicBalance", () => {
  describe("without costs nor revenues", () => {
    it("returns empty economic balance", () => {
      const result = getProjectDevelopmentEconomicBalance(baseProps);
      expect(result.details).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  // ── Coûts d'installation ─────────────────────────────────────────────────
  describe("with installationCosts", () => {
    it("adds each cost with negtive amount", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        costs: {
          ...baseProps.costs,
          developmentPlanInstallationCosts: [
            { amount: 10_000, purpose: "technical_studies" },
            { amount: 50_000, purpose: "installation_works" },
          ],
        },
      });

      const items = result.details.filter((d) => d.name === "projectInstallation");
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ total: -10_000, details: "technical_studies" });
      expect(items[1]).toMatchObject({ total: -50_000, details: "installation_works" });
      expect(result.total).toBe(-60_000);
    });

    it("ignore empty installation costs", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        costs: {
          ...baseProps.costs,
          developmentPlanInstallationCosts: [],
        },
      });
      expect(result.details.filter((d) => d.name === "projectInstallation")).toHaveLength(0);
    });
  });

  // ── Coûts de réhabilitation ───────────────────────────────────────────────
  describe("with reinstatementCosts", () => {
    it("adds reinstatement costs if projectDeveloper is reinstatementContractOwner", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        costs: {
          ...baseProps.costs,
          reinstatementCosts: [{ amount: 20_000, purpose: "deimpermeabilization" }],
        },
      });

      const items = result.details.filter((d) => d.name === "siteReinstatement");
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ total: -20_000, details: "deimpermeabilization" });
    });

    it("excludes reinstatement costs if projectDeveloper is not reinstatementContractOwner", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        stakeholders: {
          ...baseProps.stakeholders,
          project: {
            developer: { structureType: "company", structureName: "Promo SA" },
            reinstatementContractOwner: { structureType: "company", structureName: "Autre" },
          },
        },
        costs: {
          ...baseProps.costs,
          reinstatementCosts: [{ amount: 20_000, purpose: "deimpermeabilization" }],
        },
      });

      expect(result.details.filter((d) => d.name === "siteReinstatement")).toHaveLength(0);
    });

    it("excludes reinstatement costs if projectDeveloper and reinstatementContractOwner are not defined", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        stakeholders: {
          ...baseProps.stakeholders,
          project: {
            developer: { structureType: "company", structureName: undefined },
            reinstatementContractOwner: { structureType: "company", structureName: undefined },
          },
        },
        costs: {
          ...baseProps.costs,
          reinstatementCosts: [{ amount: 20_000, purpose: "deimpermeabilization" }],
        },
      });
      expect(result.details.filter((d) => d.name === "siteReinstatement")).toHaveLength(0);
    });
  });

  // ── Achat du site ─────────────────────────────────────────────────────────
  describe("with site purchase", () => {
    describe("for PHOTOVOLTAIC_POWER_PLANT project", () => {
      it("adds sitePurchaseTotalAmount if projectDeveloper is futureSiteOwner", () => {
        const result = getProjectDevelopmentEconomicBalance({
          ...baseProps,
          stakeholders: {
            ...baseProps.stakeholders,
            project: {
              developer: { structureType: "company", structureName: "Dev Corp" },
              reinstatementContractOwner: { structureType: "company", structureName: "entreprise" },
            },
            future: {
              owner: {
                structureType: "company",
                structureName: "Dev Corp",
              },
            },
          },
          costs: {
            ...baseProps.costs,
            sitePurchaseTotalAmount: 100_000,
          },
        });
        const item = result.details.find((d) => d.name === "sitePurchase");
        expect(item).toBeDefined();
        expect(item?.total).toBe(-100_000);
      });

      it("excludes sitePurchaseTotalAmount if projectDeveloper i not futureSiteOwner", () => {
        const result = getProjectDevelopmentEconomicBalance({
          ...baseProps,
          stakeholders: {
            ...baseProps.stakeholders,
            project: {
              developer: { structureType: "company", structureName: "Dev Corp" },
              reinstatementContractOwner: { structureType: "company", structureName: "entreprise" },
            },
            future: {
              owner: {
                structureType: "company",
                structureName: "Autre Propriétaire",
              },
            },
          },
          costs: {
            ...baseProps.costs,
            sitePurchaseTotalAmount: 100_000,
          },
        });
        expect(result.details.find((d) => d.name === "sitePurchase")).toBeUndefined();
      });
    });

    describe("for URBAN_PROJECT", () => {
      it("always adds sitePurchaseTotalAmount", () => {
        const result = getProjectDevelopmentEconomicBalance({
          ...baseProps,
          developmentPlanType: "URBAN_PROJECT",

          stakeholders: {
            ...baseProps.stakeholders,
            project: {
              developer: { structureType: "company", structureName: "Aménageur SA" },
              reinstatementContractOwner: { structureType: "company", structureName: "entreprise" },
            },
            future: {
              owner: {
                structureType: "municipality",
                structureName: "Collectivité",
              },
            },
          },
          costs: {
            ...baseProps.costs,
            sitePurchaseTotalAmount: 200_000,
          },
        });
        const item = result.details.find((d) => d.name === "sitePurchase");
        expect(item).toBeDefined();
        expect(item?.total).toBe(-200_000);
      });

      it("do not add sitePurchaseTotalAmount if it is not defined", () => {
        const result = getProjectDevelopmentEconomicBalance({
          ...baseProps,
          developmentPlanType: "URBAN_PROJECT",
          costs: {
            ...baseProps.costs,
            sitePurchaseTotalAmount: undefined,
          },
        });
        expect(result.details.find((d) => d.name === "sitePurchase")).toBeUndefined();
      });
    });
  });
  // ── Revente du site et des bâtiments ─────────────────────────────────────────────────────────
  describe("with site resale revenus", () => {
    it("adds siteResaleSellingPrice if exists with positive value", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        revenues: {
          ...baseProps.revenues,
          siteResaleSellingPrice: 80_000,
        },
      });
      const item = result.details.find((d) => d.name === "siteResaleRevenue");
      expect(item).toBeDefined();
      expect(item?.total).toBe(80_000);
    });

    it("adds buildingsResaleSellingPrice if exists with positive value", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        revenues: {
          ...baseProps.revenues,
          buildingsResaleSellingPrice: 300_000,
        },
      });
      const item = result.details.find((d) => d.name === "buildingsResaleRevenue");
      expect(item).toBeDefined();
      expect(item?.total).toBe(300_000);
    });

    it("excludes buildingsResaleSellingPrice and siteResaleSellingPrice if not defined or 0", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        revenues: {
          ...baseProps.revenues,
          siteResaleSellingPrice: undefined,
          buildingsResaleSellingPrice: 0,
        },
      });
      expect(result.details.find((d) => d.name === "siteResaleRevenue")).toBeUndefined();
      expect(result.details.find((d) => d.name === "buildingsResaleRevenue")).toBeUndefined();
    });
  });

  // ── Aides financières ────────────────────────────────────────────────────
  describe("with financialAssistanceRevenues", () => {
    it("adds financialAssistanceRevenues if projectDeveloper is reinstatementContractOwner", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        stakeholders: {
          ...baseProps.stakeholders,
          project: {
            developer: { structureType: "company", structureName: "Promo SA" },
            reinstatementContractOwner: { structureType: "company", structureName: "Promo SA" },
          },
          future: {
            owner: {
              structureType: "municipality",
              structureName: "Collectivité",
            },
          },
        },
        costs: {
          ...baseProps.costs,
          reinstatementCosts: [{ amount: 10_000, purpose: "remediation" }],
        },
        revenues: {
          ...baseProps.revenues,
          financialAssistanceRevenues: [
            { amount: 5_000, source: "local_or_regional_authority_participation" },
            { amount: 2_000, source: "public_subsidies" },
          ],
        },
      });

      const items = result.details.filter((d) => d.name === "financialAssistanceRevenues");
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        total: 5_000,
        details: "local_or_regional_authority_participation",
      });
      expect(items[1]).toMatchObject({ total: 2_000, details: "public_subsidies" });
    });

    it("excludes financialAssistanceRevenues if projectDeveloper is reinstatementContractOwner", () => {
      const result = getProjectDevelopmentEconomicBalance({
        ...baseProps,
        stakeholders: {
          ...baseProps.stakeholders,
          project: {
            developer: { structureType: "company", structureName: "Promo SA" },
            reinstatementContractOwner: { structureType: "company", structureName: "Autre Entité" },
          },
          future: {
            owner: {
              structureType: "municipality",
              structureName: "Collectivité",
            },
          },
        },
        revenues: {
          ...baseProps.revenues,
          financialAssistanceRevenues: [
            { amount: 5_000, source: "local_or_regional_authority_participation" },
          ],
        },
      });
      expect(result.details.filter((d) => d.name === "financialAssistanceRevenues")).toHaveLength(
        0,
      );
    });
  });

  // ── Bilan complet ─────────────────────────────────────────────────────────
  describe("getProjectDevelopmentEconomicBalance global result", () => {
    it("computes right total and details", () => {
      const result = getProjectDevelopmentEconomicBalance({
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        stakeholders: {
          ...baseProps.stakeholders,
          project: {
            developer: { structureType: "company", structureName: "SolarDev" },
            reinstatementContractOwner: { structureType: "company", structureName: "SolarDev" },
          },
          future: {
            owner: {
              structureType: "company",
              structureName: "SolarDev",
            },
          },
        },
        costs: {
          developmentPlanInstallationCosts: [{ amount: 50_000, purpose: "installation_works" }],
          reinstatementCosts: [{ amount: 10_000, purpose: "deimpermeabilization" }],
          sitePurchaseTotalAmount: 30_000,
        },
        revenues: {
          siteResaleSellingPrice: 5_000,
          buildingsResaleSellingPrice: 0,
          financialAssistanceRevenues: [
            { amount: 8_000, source: "local_or_regional_authority_participation" },
          ],
        },
      });

      expect(result.total).toBe(-77_000);
      expect(result.details).toHaveLength(5);
    });
  });
});
