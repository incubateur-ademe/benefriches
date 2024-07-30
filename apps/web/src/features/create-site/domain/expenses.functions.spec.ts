import { groupExpensesByBearer, groupExpensesByCategory } from "./expenses.functions";
import { Expense } from "./siteFoncier.types";

const buildExpense = (expenseData: Partial<Expense>): Expense => {
  return {
    bearer: "owner",
    amount: 1000,
    purpose: "maintenance",
    purposeCategory: "other",
    ...expenseData,
  };
};

describe("Expenses functions", () => {
  describe("groupExpensesByBearer", () => {
    it("returns empty array when no expenses", () => {
      const expenses: Expense[] = [];
      expect(groupExpensesByBearer(expenses)).toEqual([]);
    });

    it("should group expenses for only one bearer", () => {
      const expenses: Expense[] = [
        buildExpense({ amount: 1500, bearer: "owner" }),
        buildExpense({ amount: 1400, bearer: "owner" }),
        buildExpense({ amount: 100, bearer: "owner" }),
      ];
      expect(groupExpensesByBearer(expenses)).toEqual([{ amount: 3000, bearer: "owner" }]);
    });

    it("should group expenses for mixed bearers", () => {
      const expenses: Expense[] = [
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

  describe("groupExpensesByCategory", () => {
    it("returns empty array when no expenses", () => {
      const expenses: Expense[] = [];
      expect(groupExpensesByCategory(expenses)).toEqual([]);
    });

    it("should group expenses for only one category", () => {
      const expenses: Expense[] = [
        buildExpense({ amount: 1500, purposeCategory: "safety" }),
        buildExpense({ amount: 1400, purposeCategory: "safety" }),
        buildExpense({ amount: 100, purposeCategory: "safety" }),
      ];
      expect(groupExpensesByCategory(expenses)).toEqual([
        { amount: 3000, purposeCategory: "safety" },
      ]);
    });

    it("should group expenses for mixed categories", () => {
      const expenses: Expense[] = [
        buildExpense({ amount: 1500, purposeCategory: "taxes" }),
        buildExpense({ amount: 1400, purposeCategory: "taxes" }),
        buildExpense({ amount: 100, purposeCategory: "taxes" }),
        buildExpense({ amount: 1100, purposeCategory: "safety" }),
        buildExpense({ amount: 9000, purposeCategory: "rent" }),
        buildExpense({ amount: 2100, purposeCategory: "safety" }),
      ];
      expect(groupExpensesByCategory(expenses)).toEqual([
        { amount: 3000, purposeCategory: "taxes" },
        { amount: 3200, purposeCategory: "safety" },
        { amount: 9000, purposeCategory: "rent" },
      ]);
    });
  });
});
