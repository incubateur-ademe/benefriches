import { EconomicBalanceImpactResult } from "shared";

import {
  computeEconomicBalanceImpact,
  getEconomicResultsOfProjectExploitationForDuration,
  getEconomicResultsOfProjectInstallation,
} from "./economicBalanceImpact";

describe("EconomicBalance impact", () => {
  describe("getEconomicResultsOfProjectInstallation", () => {
    it("should return zero costs and revenues in balance when none", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          financialAssistanceRevenues: [],
          reinstatementCosts: [],
          developmentPlanInstallationCosts: [],
          sitePurchaseTotalAmount: 0,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
        }),
      ).toEqual({
        total: 0,
        costs: {
          total: 0,
        },
        revenues: {
          total: 0,
        },
      });
    });
    it("should return all costs and revenues in balance if developer is new site owner and reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
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
        }),
      ).toEqual({
        total: 50000 - (49999 + 95000 + 100000),
        costs: {
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

    it("should not use real estate transaction in balance if developer is not the new site owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
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
        }),
      ).toEqual({
        total: 50000 - (49999 + 95000),
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

    it("should not use reinstatement cost and financial assistance revenues in balance if developer is not the reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
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
        }),
      ).toEqual({
        total: -95000,
        costs: {
          total: 95000,
          developmentPlanInstallation: {
            total: 95000,
            costs: [
              { amount: 50000, purpose: "installation_works" },
              { amount: 45000, purpose: "technical_studies" },
            ],
          },
        },
        revenues: {
          total: 0,
        },
      });
    });
  });

  describe("getEconomicResultsOfProjectExploitationForDuration", () => {
    it("should return 0 for a project with no costs", () => {
      expect(getEconomicResultsOfProjectExploitationForDuration([], [], 10)).toEqual({
        total: 0,
        operationsCosts: {
          total: 0,
          costs: [],
        },
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
      });
    });

    it("should return the difference between costs and benefits multiplied by duration", () => {
      expect(
        getEconomicResultsOfProjectExploitationForDuration(
          [
            { amount: 1000, source: "rent" },
            { amount: 500, source: "other" },
          ],
          [
            { amount: 6000, purpose: "taxes" },
            { amount: 50, purpose: "maintenance" },
          ],
          10,
        ),
      ).toEqual({
        total: -45500,
        operationsCosts: {
          total: 60500,
          costs: [
            { amount: 60000, purpose: "taxes" },
            { amount: 500, purpose: "maintenance" },
          ],
        },
        operationsRevenues: {
          total: 15000,
          revenues: [
            { amount: 10000, source: "rent" },
            { amount: 5000, source: "other" },
          ],
        },
      });
      expect(
        getEconomicResultsOfProjectExploitationForDuration(
          [],
          [
            { amount: 6000, purpose: "taxes" },
            { amount: 50, purpose: "maintenance" },
          ],
          30,
        ),
      ).toEqual({
        total: -181500,
        operationsCosts: {
          total: 181500,
          costs: [
            { amount: 180000, purpose: "taxes" },
            { amount: 1500, purpose: "maintenance" },
          ],
        },
        operationsRevenues: {
          total: 0,
          revenues: [],
        },
      });
    });
  });

  describe("computeEconomicBalanceImpact", () => {
    it("should sum installation result and operation result if projectDeveloper is futureOperator", () => {
      expect(
        computeEconomicBalanceImpact(
          {
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
          1,
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
          20,
        ),
      ).toEqual({
        total: 500000 - (1210000 + 49999 + 150000),
        bearer: "Mairie de Blajan",
        costs: {
          total: 1210000 + 49999 + 150000,
          operationsCosts: {
            total: 1210000,
            costs: [
              { amount: 1200000, purpose: "taxes" },
              { amount: 10000, purpose: "maintenance" },
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
          total: 500000,
          siteResale: 150000,
          operationsRevenues: {
            total: 300000,
            revenues: [
              { amount: 200000, source: "rent" },
              { amount: 100000, source: "other" },
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

    it("should sum installation and reinstatement result only if projectDeveloper is not futureOperator", () => {
      expect(
        computeEconomicBalanceImpact(
          {
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
          1,
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
          20,
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
