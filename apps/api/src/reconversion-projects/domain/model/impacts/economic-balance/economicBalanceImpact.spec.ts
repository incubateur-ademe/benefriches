import {
  computeEconomicBalanceImpact,
  getEconomicResultsOfProjectExploitationForDuration,
  getEconomicResultsOfProjectInstallation,
} from "./economicBalanceImpact";

describe("EconomicBalance impact", () => {
  describe("getEconomicResultsOfProjectInstallation", () => {
    it("should return all costs and revenues in balance if operator is new site owner and reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          reinstatementFinancialAssistanceAmount: 50000,
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermebilization" },
          ],
          developmentPlanInstallationCost: 150000,
          realEstateTransactionTotalCost: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Mairie de Blajan",
          reinstatementContractOwnerName: "Mairie de Blajan",
        }),
      ).toEqual({
        total: 50000 - (49999 + 150000 + 100000),
        costs: {
          total: 49999 + 150000 + 100000,
          siteReinstatement: {
            total: 49999,
            costs: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
          },
          developmentPlanInstallation: 150000,
          realEstateTransaction: 100000,
        },
        revenues: {
          total: 50000,
          financialAssistance: 50000,
        },
      });
    });

    it("should not use real estate transaction in balance if operator is not the new site owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          reinstatementFinancialAssistanceAmount: 50000,
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermebilization" },
          ],
          developmentPlanInstallationCost: 150000,
          realEstateTransactionTotalCost: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Mairie de Blajan",
        }),
      ).toEqual({
        total: 50000 - (49999 + 150000),
        costs: {
          total: 49999 + 150000,
          siteReinstatement: {
            total: 49999,
            costs: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
          },
          developmentPlanInstallation: 150000,
        },
        revenues: {
          total: 50000,
          financialAssistance: 50000,
        },
      });
    });

    it("should not use reinstatement cost in balance if operator is not the reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          reinstatementFinancialAssistanceAmount: 50000,
          reinstatementCosts: [
            { amount: 10000, purpose: "waste_collection" },
            { amount: 39999, purpose: "deimpermebilization" },
          ],
          developmentPlanInstallationCost: 150000,
          realEstateTransactionTotalCost: 100000,
          futureOperatorName: "Mairie de Blajan",
          developmentPlanDeveloperName: "Mairie de Blajan",
          futureSiteOwnerName: "Acheteur",
          reinstatementContractOwnerName: "Propriétaire",
        }),
      ).toEqual({
        total: -150000,
        costs: {
          total: 150000,
          developmentPlanInstallation: 150000,
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
            { amount: 2000, source: "sell" },
            { amount: 500, source: "other" },
          ],
          [
            { amount: 6000, purpose: "taxes" },
            { amount: 50, purpose: "maintenance" },
          ],
          10,
        ),
      ).toEqual({
        total: -25500,
        operationsCosts: {
          total: 60500,
          costs: [
            { amount: 60000, purpose: "taxes" },
            { amount: 500, purpose: "maintenance" },
          ],
        },
        operationsRevenues: {
          total: 35000,
          revenues: [
            { amount: 10000, source: "rent" },
            { amount: 20000, source: "sell" },
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
            reinstatementFinancialAssistanceAmount: 50000,
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
            developmentPlanInstallationCost: 150000,
            realEstateTransactionTotalCost: 100000,
            futureOperatorName: "Mairie de Blajan",
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
          operationsCosts: {
            total: 0,
            costs: [],
          },
          developmentPlanInstallation: 150000,
        },
        revenues: {
          total: 0,
          operationsRevenues: {
            total: 0,
            revenues: [],
          },
        },
      });

      expect(
        computeEconomicBalanceImpact(
          {
            reinstatementFinancialAssistanceAmount: 50000,
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
            developmentPlanInstallationCost: 150000,
            realEstateTransactionTotalCost: 100000,
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
              { amount: 20000, source: "sell" },
              { amount: 5000, source: "other" },
            ],
          },
          20,
        ),
      ).toEqual({
        total: 750000 - (1210000 + 49999 + 150000),
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
              { amount: 39999, purpose: "deimpermebilization" },
            ],
          },
          developmentPlanInstallation: 150000,
        },
        revenues: {
          total: 750000,
          operationsRevenues: {
            total: 700000,
            revenues: [
              { amount: 200000, source: "rent" },
              { amount: 400000, source: "sell" },
              { amount: 100000, source: "other" },
            ],
          },
          financialAssistance: 50000,
        },
      });
    });

    it("should sum installation and reinstatement result only if projectDeveloper is not futureOperator", () => {
      expect(
        computeEconomicBalanceImpact(
          {
            reinstatementFinancialAssistanceAmount: 50000,
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
            developmentPlanInstallationCost: 150000,
            realEstateTransactionTotalCost: 100000,
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
          developmentPlanInstallation: 150000,
        },
        revenues: {
          total: 0,
        },
      });

      expect(
        computeEconomicBalanceImpact(
          {
            reinstatementFinancialAssistanceAmount: 50000,
            reinstatementCosts: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
            developmentPlanInstallationCost: 150000,
            realEstateTransactionTotalCost: 100000,
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
              { amount: 20000, source: "sell" },
              { amount: 5000, source: "other" },
            ],
          },
          20,
        ),
      ).toEqual({
        total: 50000 - (49999 + 150000),
        bearer: "Mairie de Blajan",
        costs: {
          total: 49999 + 150000,
          siteReinstatement: {
            total: 49999,
            costs: [
              { amount: 10000, purpose: "waste_collection" },
              { amount: 39999, purpose: "deimpermebilization" },
            ],
          },
          developmentPlanInstallation: 150000,
        },
        revenues: {
          total: 50000,
          financialAssistance: 50000,
        },
      });
    });
  });
});
