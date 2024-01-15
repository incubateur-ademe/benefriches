import { Owner, Project, ProjectSite, ProjectStakeholder } from "../projects.types";
import {
  getEconomicResultsOfProjectExploitationPerYear,
  getEconomicResultsOfProjectForDuration,
  getEconomicResultsOfProjectInstallation,
  getEconomicResultsOfSiteForDuration,
  getEconomicResultsOfSitePerYear,
  getIsOperatorOwnerOfReinstatementCost,
} from "./economicResults";

import { SoilType } from "@/shared/domain/soils";

const PROJECT_MOCKED = {
  id: "4343b02e-d066-437c-b626-4fbd1ef2ed18",
  name: "Centrale photovoltaique",
  relatedSiteId: "03a53ffd-4f71-419e-8d04-041311eefa23",
  soilsDistribution: {
    [SoilType.BUILDINGS]: 400,
    [SoilType.MINERAL_SOIL]: 500,
    [SoilType.PRAIRIE_GRASS]: 2000,
  },
  futureOperator: {
    name: "Test",
    structureType: "company",
  } as ProjectStakeholder,
  photovoltaicPanelsInstallationCost: 150000,
  financialAssistanceRevenue: 50000,
  yearlyProjectedCosts: [],
  yearlyProjectedRevenue: [],
} as Project;

const SITE_MOCKED = {
  id: "03a53ffd-4f71-419e-8d04-041311eefa23",
  isFriche: true,
  owner: { name: "", structureType: "company" } as Owner,
  name: "Friche industrielle",
  surfaceArea: 2900,
  hasContaminatedSoils: false,
  address: {
    lat: 2.347,
    long: 48.859,
    city: "Paris",
    id: "75110_7043",
    cityCode: "75110",
    postCode: "75010",
    value: "Rue de Paradis 75010 Paris",
  },
  soilsDistribution: {
    [SoilType.BUILDINGS]: 1400,
    [SoilType.MINERAL_SOIL]: 1500,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
} as ProjectSite;

describe("economicResults computation functions", () => {
  describe("getIsOperatorOwnerOfReinstatementCost", () => {
    it("returns true when reinstatement cost owner is not defined", () => {
      expect(
        getIsOperatorOwnerOfReinstatementCost(
          PROJECT_MOCKED.futureOperator,
          PROJECT_MOCKED.reinstatementContractOwner,
        ),
      ).toEqual(true);
    });

    it("returns false when operator is not reinstatement cost owner", () => {
      expect(
        getIsOperatorOwnerOfReinstatementCost(PROJECT_MOCKED.futureOperator, {
          name: "Autre entreprise",
          structureType: "company",
        }),
      ).toEqual(false);
    });

    it("returns true when operator is reinstatement cost owner", () => {
      expect(
        getIsOperatorOwnerOfReinstatementCost(
          PROJECT_MOCKED.futureOperator,
          PROJECT_MOCKED.futureOperator,
        ),
      ).toEqual(true);
    });
  });

  describe("getEconomicResultsOfProjectInstallation", () => {
    it("should return the difference between installation costs, reinstatement costs and financial assistance when operator is reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          ...PROJECT_MOCKED,
          reinstatementCost: 500000,
        }),
      ).toEqual(50000 - 150000 - 500000);
    });

    it("should only return the difference between installation costs and financial assistance when operator is not reinstatement cost owner", () => {
      expect(
        getEconomicResultsOfProjectInstallation({
          ...PROJECT_MOCKED,
          reinstatementContractOwner: { name: "Autre entreprise", structureType: "company" },
          reinstatementCost: 500000,
        }),
      ).toEqual(-150000);
    });
  });

  describe("getEconomicResultsOfProjectExploitationPerYear", () => {
    it("should return 0 for a project with no expenses and costs filled", () => {
      expect(getEconomicResultsOfProjectExploitationPerYear(PROJECT_MOCKED)).toEqual(0);
    });

    it("should return the difference between costs and benefits per year", () => {
      expect(
        getEconomicResultsOfProjectExploitationPerYear({
          ...PROJECT_MOCKED,
          yearlyProjectedCosts: [{ amount: 1000 }, { amount: 2000 }, { amount: 500 }],
          yearlyProjectedRevenue: [{ amount: 6000 }, { amount: 50 }],
        }),
      ).toEqual(2550);
    });
  });
  describe("getEconomicResultsOfProjectForDuration", () => {
    it("should only return economic result of installation for project with no annual expenses filled and a duration of 1 year", () => {
      expect(getEconomicResultsOfProjectForDuration(PROJECT_MOCKED, 1)).toEqual(-100000);
    });

    it("should only return economic result of installation for project with no annual expenses filled and a duration of 10 year", () => {
      expect(getEconomicResultsOfProjectForDuration(PROJECT_MOCKED, 10)).toEqual(-100000);
    });

    it("should the sum of installation and annual economic results for an duration of 1 year", () => {
      expect(
        getEconomicResultsOfProjectForDuration(
          {
            ...PROJECT_MOCKED,
            yearlyProjectedCosts: [{ amount: 1000 }, { amount: 2000 }, { amount: 500 }],
            yearlyProjectedRevenue: [{ amount: 6000 }, { amount: 50 }],
          },
          1,
        ),
      ).toEqual(-100000 + 2550);
    });

    it("should the sum of installation and annual economic results multiplied by 10 for an duration of 10 year", () => {
      expect(
        getEconomicResultsOfProjectForDuration(
          {
            ...PROJECT_MOCKED,
            yearlyProjectedCosts: [{ amount: 1000 }, { amount: 2000 }, { amount: 500 }],
            yearlyProjectedRevenue: [{ amount: 6000 }, { amount: 50 }],
          },
          10,
        ),
      ).toEqual(-100000 + 25500);
    });
  });

  describe("getEconomicResultsOfSitePerYear", () => {
    it("returns should return 0 for a site with no expenses nor costs", () => {
      expect(getEconomicResultsOfSitePerYear(SITE_MOCKED)).toEqual(0);
    });

    it("returns should return the difference between costs and incomes of owner only", () => {
      expect(
        getEconomicResultsOfSitePerYear({
          ...SITE_MOCKED,
          yearlyExpenses: [
            { amount: 750, type: "", bearer: "owner", category: "rent" },
            { amount: 150, type: "", bearer: "owner", category: "safety" },
            { amount: 500, type: "", bearer: "tenant", category: "taxes" },
            { amount: 1500, bearer: "tenant", category: "soils_degradation", type: "" },
          ],
          yearlyIncomes: [{ type: "operationsIncome", amount: 700 }],
        }),
      ).toEqual(-200);
    });
  });

  describe("getEconomicResultsOfSiteForDuration", () => {
    it("returns should return 0 for a site with no expenses nor costs", () => {
      expect(getEconomicResultsOfSiteForDuration(SITE_MOCKED, 1)).toEqual(0);
    });

    it("should return economic result of site multiplied by 10 for a duration of 10 year", () => {
      expect(
        getEconomicResultsOfSiteForDuration(
          {
            ...SITE_MOCKED,
            yearlyExpenses: [
              { amount: 750, type: "", bearer: "owner", category: "rent" },
              { amount: 500, type: "", bearer: "tenant", category: "taxes" },
              { amount: 1500, bearer: "tenant", category: "soils_degradation", type: "" },
            ],
            yearlyIncomes: [{ type: "operationsIncome", amount: 700 }],
          },
          10,
        ),
      ).toEqual(-500);
    });
  });
});
