import { SiteYearlyExpense } from "shared";

import { groupExpensesByBearer } from "./expenses.functions";

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
});
