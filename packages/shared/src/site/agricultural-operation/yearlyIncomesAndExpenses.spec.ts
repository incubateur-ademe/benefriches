import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sumListWithKey } from "../../services/index.js";
import { computeAgriculturalOperationYearlyExpenses } from "./yearlyExpenses.js";
import { computeAgriculturalOperationYearlyIncomes } from "./yearlyIncomes.js";

const AgriculturalOperationActivity = [
  "CEREALS_AND_OILSEEDS_CULTIVATION",
  "LARGE_VEGETABLE_CULTIVATION",
  "MARKET_GARDENING",
  "FLOWERS_AND_HORTICULTURE",
  "VITICULTURE",
  "FRUITS_AND_OTHER_PERMANENT_CROPS",
  "CATTLE_FARMING",
  "PIG_FARMING",
  "POULTRY_FARMING",
  "SHEEP_AND_GOAT_FARMING",
  "POLYCULTURE_AND_LIVESTOCK",
] as const;

const SURFACE_AREA = 15000;

describe("computeAgriculturalOperationYearlyExpenses and computeAgriculturalOperationYearlyIncomes", () => {
  for (const type of AgriculturalOperationActivity) {
    it(`should generate coherent expenses and incomes for agricultural operation: ${type}`, () => {
      const expenses = computeAgriculturalOperationYearlyExpenses(type, SURFACE_AREA, "owner");
      const incomes = computeAgriculturalOperationYearlyIncomes(type, SURFACE_AREA);

      const totalExpenses = sumListWithKey(expenses, "amount");
      const totalIncomes = sumListWithKey(incomes, "amount");

      assert.ok(totalIncomes > totalExpenses);
      assert.strictEqual(totalIncomes - totalExpenses < 50000, true);
    });
  }
});
