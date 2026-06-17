import { computeEstimatedPropertyTaxesAmount } from "../financial/propertyTaxes";
import {
  computeFricheDefaultYearlyExpenses,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "./yearlyExpenses";

describe("computeFricheDefaultYearlyExpenses", () => {
  const surfaceArea = 5000;
  const population = 10000;
  const buildingsSurface = 200;

  it("includes illegal dumping and security expenses for a friche without buildings", () => {
    const expenses = computeFricheDefaultYearlyExpenses({ surfaceArea, population });

    expect(expenses).toEqual([
      {
        amount: computeIllegalDumpingDefaultCost(population),
        purpose: "illegalDumpingCost",
        bearer: "owner",
      },
      { amount: computeSecurityDefaultCost(surfaceArea), purpose: "security", bearer: "owner" },
    ]);
  });

  it("adds maintenance and property taxes expenses when the friche has buildings", () => {
    const expenses = computeFricheDefaultYearlyExpenses({
      surfaceArea,
      population,
      buildingsSurface,
    });

    expect(expenses).toEqual([
      {
        amount: computeIllegalDumpingDefaultCost(population),
        purpose: "illegalDumpingCost",
        bearer: "owner",
      },
      { amount: computeSecurityDefaultCost(surfaceArea), purpose: "security", bearer: "owner" },
      {
        amount: computeMaintenanceDefaultCost(buildingsSurface),
        purpose: "maintenance",
        bearer: "owner",
      },
      {
        amount: computeEstimatedPropertyTaxesAmount(buildingsSurface),
        purpose: "propertyTaxes",
        bearer: "owner",
      },
    ]);
  });

  it("omits the security expense when the city is in a rural zone", () => {
    const expenses = computeFricheDefaultYearlyExpenses({
      surfaceArea,
      population,
      buildingsSurface,
      isCityInRuralZone: true,
    });

    expect(expenses.map(({ purpose }) => purpose)).toEqual([
      "illegalDumpingCost",
      "maintenance",
      "propertyTaxes",
    ]);
  });

  it("includes the security expense by default when rurality is not provided", () => {
    const expenses = computeFricheDefaultYearlyExpenses({ surfaceArea, population });

    expect(expenses.some(({ purpose }) => purpose === "security")).toBe(true);
  });
});
