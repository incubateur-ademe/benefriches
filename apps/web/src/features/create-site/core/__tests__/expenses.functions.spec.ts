import { SiteYearlyExpense } from "shared";

import {
  getSiteManagementExpensesBaseConfig,
  getSiteSecurityExpensesBaseConfig,
  groupExpensesByBearer,
} from "../expenses.functions";

const buildExpense = (expenseData: Partial<SiteYearlyExpense>): SiteYearlyExpense => {
  return {
    bearer: "owner",
    amount: 1000,
    purpose: "maintenance",
    ...expenseData,
  };
};

describe("Expenses functions", () => {
  describe("groupExpensesByBearer", () => {
    it("returns empty array when no expenses", () => {
      const expenses: SiteYearlyExpense[] = [];
      expect(groupExpensesByBearer(expenses)).toEqual([]);
    });

    it("should group expenses for only one bearer", () => {
      const expenses: SiteYearlyExpense[] = [
        buildExpense({ amount: 1500, bearer: "owner" }),
        buildExpense({ amount: 1400, bearer: "owner" }),
        buildExpense({ amount: 100, bearer: "owner" }),
      ];
      expect(groupExpensesByBearer(expenses)).toEqual([{ amount: 3000, bearer: "owner" }]);
    });

    it("should group expenses for mixed bearers", () => {
      const expenses: SiteYearlyExpense[] = [
        buildExpense({ amount: 1500, bearer: "owner" }),
        buildExpense({ amount: 1400, bearer: "owner" }),
        buildExpense({ amount: 100, bearer: "owner" }),
        buildExpense({ amount: 1100, bearer: "tenant" }),
        buildExpense({ amount: 9000, bearer: "owner" }),
        buildExpense({ amount: 2100, bearer: "tenant" }),
      ];
      expect(groupExpensesByBearer(expenses)).toEqual([
        { amount: 12000, bearer: "owner" },
        { amount: 3200, bearer: "tenant" },
      ]);
    });
  });

  describe("getSiteManagementExpensesBaseConfig", () => {
    it("returns default site management expenses for friche with tenant", () => {
      const input = { hasTenant: true, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
      ]);
    });

    it("returns default site management expenses for friche with no tenant", () => {
      const input = { hasTenant: false, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });

    it("returns default site management expenses for site operated by owner", () => {
      const input = { hasTenant: false, isOperated: true };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "operationsTaxes", fixedBearer: "owner" },
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });

    it("returns default site management expenses for site operated by tenant", () => {
      const input = { hasTenant: true, isOperated: true };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "rent", fixedBearer: "tenant" },
        { purpose: "operationsTaxes", fixedBearer: "tenant" },
        { purpose: "maintenance", fixedBearer: "tenant" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: null },
      ]);
    });

    it("returns default site management expenses for site not operated", () => {
      const input = { hasTenant: false, isOperated: false };
      expect(getSiteManagementExpensesBaseConfig(input)).toEqual([
        { purpose: "maintenance", fixedBearer: "owner" },
        { purpose: "propertyTaxes", fixedBearer: "owner" },
        { purpose: "otherManagementCosts", fixedBearer: "owner" },
      ]);
    });
  });

  describe("getSiteSecurityExpensesBaseConfig", () => {
    it("returns expenses for friche with tenant and recent accident", () => {
      const input = {
        hasTenant: true,
        hasRecentAccidents: true,
      };
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: null },
        { purpose: "illegalDumpingCost", fixedBearer: null },
        { purpose: "otherSecuringCosts", fixedBearer: null },
        { purpose: "accidentsCost", fixedBearer: null },
      ]);
    });

    it("returns expenses for friche with no tenant and recent accident", () => {
      const input = {
        hasTenant: false,
        hasRecentAccidents: true,
      };
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
        { purpose: "accidentsCost", fixedBearer: "owner" },
      ]);
    });

    it("returns expenses for friche with tenant and no recent accident", () => {
      const input = {
        hasTenant: true,
        hasRecentAccidents: false,
      };
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: null },
        { purpose: "illegalDumpingCost", fixedBearer: null },
        { purpose: "otherSecuringCosts", fixedBearer: null },
      ]);
    });

    it("returns expenses for friche with no tenant and no recent accident", () => {
      const input = {
        hasTenant: false,
        hasRecentAccidents: false,
      };
      expect(getSiteSecurityExpensesBaseConfig(input)).toEqual([
        { purpose: "security", fixedBearer: "owner" },
        { purpose: "illegalDumpingCost", fixedBearer: "owner" },
        { purpose: "otherSecuringCosts", fixedBearer: "owner" },
      ]);
    });
  });
});
