import { EconomicBalanceImpactResult } from "shared";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeEconomicBalanceImpact } from "./economicBalanceImpact";

describe("EconomicBalance impact", () => {
  describe("project installation", () => {
    it("should return zero costs and revenues in balance when none", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "URBAN_PROJECT",
          financialAssistanceRevenues: [],
          reinstatementCosts: [],
          developmentPlanInstallationCosts: [],
          sitePurchaseTotalAmount: 0,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(result.total).toEqual(0);

      expect(result.costs.total).toEqual(0);
      expect(result.revenues.total).toEqual(0);
    });
    it("should return all costs and revenues in balance if developer is new site owner and reinstatement cost owner", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );
      expect(result.total).toEqual(50000 - (49999 + 95000 + 100000));
      expect(result.costs).toEqual({
        total: 49999 + 95000 + 100000,
        siteReinstatement: {
          total: 49999,
          costs: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
        },
        developmentPlanInstallation: {
          total: 95000,
          costs: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
        },
        operationsCosts: {
          total: 0,
          costs: [],
        },
        sitePurchase: 100000,
      });

      expect(result.revenues).toEqual({
        total: 50000,
        buildingsResale: undefined,
        siteResale: undefined,
        financialAssistance: {
          total: 50000,
          revenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
        },
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
      });
    });

    it("should return all costs and revenues in balance if developer is and reinstatement cost owner and is urban project", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "URBAN_PROJECT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(result.total).toEqual(50000 - (49999 + 95000 + 100000));
      expect(result.costs).toEqual({
        total: 49999 + 95000 + 100000,
        siteReinstatement: {
          total: 49999,
          costs: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
        },
        developmentPlanInstallation: {
          total: 95000,
          costs: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
        },
        sitePurchase: 100000,
        operationsCosts: {
          total: 0,
          costs: [],
        },
      });

      expect(result.revenues).toEqual({
        total: 50000,
        financialAssistance: {
          total: 50000,
          revenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
        },
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
      });
    });

    it("should not use real estate transaction in balance if developer is not the new site owner", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Mairie de Blajan",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(result.total).toEqual(50000 - (49999 + 95000));
      expect(result.costs).toEqual({
        total: 49999 + 95000,
        siteReinstatement: {
          total: 49999,
          costs: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
        },
        operationsCosts: {
          total: 0,
          costs: [],
        },
        developmentPlanInstallation: {
          total: 95000,
          costs: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
        },
      });

      expect(result.revenues).toEqual({
        total: 50000,
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
        financialAssistance: {
          total: 50000,
          revenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
        },
      });
    });

    it("should not use reinstatement cost and financial assistance revenues in balance if developer is not the reinstatement cost owner", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Un autre acteur",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(result.total).toEqual(-95000);
      expect(result.costs).toEqual({
        total: 95000,
        operationsCosts: {
          total: 0,
          costs: [],
        },
        developmentPlanInstallation: {
          total: 95000,
          costs: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
        },
      });

      expect(result.revenues).toEqual({
        total: 0,
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
      });
    });
  });

  describe("project exploitation", () => {
    it("should return 0 for a project with no costs", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Un autre acteur",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(
        (result.revenues.operationsRevenues?.total ?? 0) -
          (result.costs.operationsCosts?.total ?? 0),
      ).toEqual(0);
      expect(result.costs.operationsCosts).toEqual({
        total: 0,
        costs: [],
      });

      expect(result.revenues.operationsRevenues).toEqual({
        total: 0,
        revenues: [],
      });
    });

    it("should return the difference between costs and benefits actualized with discount factor", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Un autre acteur",
          yearlyProjectedRevenues: [
            { amount: 1000, source: "rent" },
            { amount: 500, source: "other" },
          ],
          yearlyProjectedCosts: [
            { amount: 6000, purpose: "taxes" },
            { amount: 50, purpose: "maintenance" },
          ],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      );

      expect(
        (result.revenues.operationsRevenues?.total ?? 0) -
          (result.costs.operationsCosts?.total ?? 0),
      ).toEqual(-37623);
      expect(result.costs.operationsCosts).toEqual({
        total: 50026,
        costs: [
          { amount: 49613, purpose: "taxes" },
          { amount: 413, purpose: "maintenance" },
        ],
      });

      expect(result.revenues.operationsRevenues).toEqual({
        total: 12403,
        revenues: [
          { amount: 8269, source: "rent" },
          { amount: 4134, source: "other" },
        ],
      });

      const resultWithNoRevenues = computeEconomicBalanceImpact(
        {
          developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          financialAssistanceRevenues: [
            { amount: 45000, source: "public_subsidies" },
            { amount: 5000, source: "other" },
          ],
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermeabilization" },
          ],
          developmentPlanInstallationCosts: [
            { amount: 50000, purpose: "installation_works" },
            { amount: 45000, purpose: "technical_studies" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Un autre acteur",
          yearlyProjectedRevenues: [],
          yearlyProjectedCosts: [
            { amount: 6000, purpose: "taxes" },
            { amount: 50, purpose: "maintenance" },
          ],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 30,
          operationsFirstYear: 2025,
        }),
      );

      expect(
        (resultWithNoRevenues.revenues.operationsRevenues?.total ?? 0) -
          (resultWithNoRevenues.costs.operationsCosts?.total ?? 0),
      ).toEqual(-102982);
      expect(resultWithNoRevenues.costs.operationsCosts).toEqual({
        total: 102982,
        costs: [
          { amount: 102131, purpose: "taxes" },
          { amount: 851, purpose: "maintenance" },
        ],
      });

      expect(resultWithNoRevenues.revenues.operationsRevenues).toEqual({
        total: 0,
        revenues: [],
      });
    });
  });

  describe("computeEconomicBalanceImpact", () => {
    it("should sum installation result and operation result if projectDeveloper is futureOperator", () => {
      expect(
        computeEconomicBalanceImpact(
          {
            developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",

            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
            developmentPlanInstallationCosts: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 45000, purpose: "technical_studies" },
            ],
            sitePurchaseTotalAmount: 100000,
            futureOperatorName: "Mairie de Blajan",
            developmentPlanDeveloperName: "Mairie de Blajan",
            futureSiteOwnerName: "Acheteur",
            reinstatementContractOwnerName: "Propriétaire",
            yearlyProjectedCosts: [],
            yearlyProjectedRevenues: [],
            siteResaleSellingPrice: 150000,
            buildingsResaleSellingPrice: 199000,
          },
          new SumOnEvolutionPeriodService({
            evaluationPeriodInYears: 1,
            operationsFirstYear: 2025,
          }),
        ),
      ).toEqual<EconomicBalanceImpactResult>({
        total: 254000,
        bearer: "Mairie de Blajan",
        costs: {
          total: 95000,
          operationsCosts: {
            total: 0,
            costs: [],
          },
          developmentPlanInstallation: {
            total: 95000,
            costs: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 45000, purpose: "technical_studies" },
            ],
          },
        },
        revenues: {
          total: 349000,
          siteResale: 150000,
          buildingsResale: 199000,
          operationsRevenues: {
            total: 0,
            revenues: [],
          },
        },
      });

      expect<EconomicBalanceImpactResult>(
        computeEconomicBalanceImpact(
          {
            developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",

            financialAssistanceRevenues: [
              { amount: 45000, source: "public_subsidies" },
              { amount: 5000, source: "other" },
            ],
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
            developmentPlanInstallationCosts: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 100000, purpose: "technical_studies" },
            ],
            sitePurchaseTotalAmount: 100000,
            futureOperatorName: "Mairie de Blajan",
            developmentPlanDeveloperName: "Mairie de Blajan",
            futureSiteOwnerName: "Acheteur",
            reinstatementContractOwnerName: "Mairie de Blajan",
            yearlyProjectedCosts: [
              { amount: 60000, purpose: "taxes" },
              { amount: 500, purpose: "maintenance" },
            ],
            yearlyProjectedRevenues: [
              { amount: 10000, source: "rent" },
              { amount: 5000, source: "other" },
            ],
            siteResaleSellingPrice: 150000,
            buildingsResaleSellingPrice: 0,
          },
          new SumOnEvolutionPeriodService({
            evaluationPeriodInYears: 20,
            operationsFirstYear: 2025,
          }),
        ),
      ).toEqual({
        total: 403899 - (822394 + 49999 + 150000),
        bearer: "Mairie de Blajan",
        costs: {
          total: 822394 + 49999 + 150000,
          operationsCosts: {
            total: 822394,
            costs: [
              { amount: 815598, purpose: "taxes" },
              { amount: 6797, purpose: "maintenance" },
            ],
          },
          siteReinstatement: {
            total: 49999,
            costs: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
          },
          developmentPlanInstallation: {
            total: 150000,
            costs: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 100000, purpose: "technical_studies" },
            ],
          },
        },
        revenues: {
          total: 403899,
          siteResale: 150000,
          operationsRevenues: {
            total: 203899,
            revenues: [
              { amount: 135933, source: "rent" },
              { amount: 67966, source: "other" },
            ],
          },
          financialAssistance: {
            total: 50000,
            revenues: [
              { amount: 45000, source: "public_subsidies" },
              { amount: 5000, source: "other" },
            ],
          },
        },
      });
    });

    it("should expose buildings construction and rehabilitation costs as a dedicated cost group for urban projects", () => {
      const result = computeEconomicBalanceImpact(
        {
          developmentPlanType: "URBAN_PROJECT",
          reinstatementCosts: [],
          developmentPlanInstallationCosts: [{ amount: 50000, purpose: "development_works" }],
          buildingsConstructionAndRehabilitationCosts: [
            { amount: 30000, purpose: "technical_studies_and_fees" },
            { amount: 250000, purpose: "buildings_construction_works" },
            { amount: 80000, purpose: "buildings_rehabilitation_works" },
            { amount: 5000, purpose: "other_construction_expenses" },
          ],
          sitePurchaseTotalAmount: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
          yearlyProjectedCosts: [],
          yearlyProjectedRevenues: [],
        },
        new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 1,
          operationsFirstYear: 2025,
        }),
      );

      expect(result.costs.buildingsConstructionAndRehabilitation).toEqual({
        total: 365000,
        costs: [
          { amount: 30000, purpose: "technical_studies_and_fees" },
          { amount: 250000, purpose: "buildings_construction_works" },
          { amount: 80000, purpose: "buildings_rehabilitation_works" },
          { amount: 5000, purpose: "other_construction_expenses" },
        ],
      });
      expect(result.costs.total).toEqual(50000 + 365000 + 100000);
      expect(result.total).toEqual(-(50000 + 365000 + 100000));
    });

    it("should sum installation and reinstatement result only if projectDeveloper is not futureOperator", () => {
      expect(
        computeEconomicBalanceImpact(
          {
            developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
            developmentPlanInstallationCosts: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 100000, purpose: "technical_studies" },
            ],
            sitePurchaseTotalAmount: 100000,
            futureOperatorName: "Exploitant",
            developmentPlanDeveloperName: "Mairie de Blajan",
            futureSiteOwnerName: "Acheteur",
            reinstatementContractOwnerName: "Propriétaire",
            yearlyProjectedCosts: [],
            yearlyProjectedRevenues: [],
          },
          new SumOnEvolutionPeriodService({
            evaluationPeriodInYears: 1,
            operationsFirstYear: 2025,
          }),
        ),
      ).toEqual({
        total: -150000,
        bearer: "Mairie de Blajan",
        costs: {
          total: 150000,
          developmentPlanInstallation: {
            total: 150000,
            costs: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 100000, purpose: "technical_studies" },
            ],
          },
        },
        revenues: {
          total: 0,
        },
      });

      expect(
        computeEconomicBalanceImpact(
          {
            developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",

            financialAssistanceRevenues: [
              { amount: 45000, source: "public_subsidies" },
              { amount: 5000, source: "other" },
            ],
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
            developmentPlanInstallationCosts: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 45000, purpose: "technical_studies" },
            ],
            sitePurchaseTotalAmount: 100000,
            futureOperatorName: "Exploitant",
            developmentPlanDeveloperName: "Mairie de Blajan",
            futureSiteOwnerName: "Acheteur",
            reinstatementContractOwnerName: "Mairie de Blajan",
            yearlyProjectedCosts: [
              { amount: 60000, purpose: "taxes" },
              { amount: 500, purpose: "maintenance" },
            ],
            yearlyProjectedRevenues: [
              { amount: 10000, source: "rent" },
              { amount: 5000, source: "other" },
            ],
          },
          new SumOnEvolutionPeriodService({
            evaluationPeriodInYears: 20,
            operationsFirstYear: 2025,
          }),
        ),
      ).toEqual({
        total: 50000 - (49999 + 95000),
        bearer: "Mairie de Blajan",
        costs: {
          total: 49999 + 95000,
          siteReinstatement: {
            total: 49999,
            costs: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermeabilization" },
            ],
          },
          developmentPlanInstallation: {
            total: 95000,
            costs: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 45000, purpose: "technical_studies" },
            ],
          },
        },
        revenues: {
          total: 50000,
          financialAssistance: {
            total: 50000,
            revenues: [
              { amount: 45000, source: "public_subsidies" },
              { amount: 5000, source: "other" },
            ],
          },
        },
      });
    });
  });
});
