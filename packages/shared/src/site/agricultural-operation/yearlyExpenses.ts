import { roundTo2Digits } from "../../services";
import { convertSquareMetersToHectares } from "../../surface-area";
import { SiteYearlyExpense } from "../yearlyExpenses";
import { AgriculturalOperationActivity } from "./operationActivity";

export const EXPENSES_EURO_PER_HECTARE_PER_YEAR = {
  CATTLE_FARMING: {
    rent: 110,
    operationsTaxes: 20,
    otherOperationsCosts: 1930,
  },
  CEREALS_AND_OILSEEDS_CULTIVATION: {
    rent: 130,
    operationsTaxes: 20,
    otherOperationsCosts: 1420,
  },
  LARGE_VEGETABLE_CULTIVATION: {
    rent: 220,
    operationsTaxes: 30,
    otherOperationsCosts: 2630,
  },
  MARKET_GARDENING: {
    rent: 320,
    operationsTaxes: 120,
    otherOperationsCosts: 19260,
  },
  FLOWERS_AND_HORTICULTURE: {
    rent: 530,
    operationsTaxes: 260,
    otherOperationsCosts: 31740,
  },
  VITICULTURE: {
    rent: 1010,
    operationsTaxes: 120,
    otherOperationsCosts: 7240,
  },
  FRUITS_AND_OTHER_PERMANENT_CROPS: {
    rent: 250,
    operationsTaxes: 60,
    otherOperationsCosts: 6820,
  },
  PIG_FARMING: {
    rent: 170,
    operationsTaxes: 50,
    otherOperationsCosts: 10700,
  },
  POULTRY_FARMING: {
    rent: 160,
    operationsTaxes: 30,
    otherOperationsCosts: 4320,
  },
  SHEEP_AND_GOAT_FARMING: {
    rent: 60,
    operationsTaxes: 10,
    otherOperationsCosts: 1330,
  },
  POLYCULTURE_AND_LIVESTOCK: {
    rent: 130,
    operationsTaxes: 20,
    otherOperationsCosts: 2200,
  },
};

export const computeAgriculturalOperationYearlyExpenses = (
  operationActivity: AgriculturalOperationActivity,
  surfaceArea: number,
  bearer: "owner" | "tenant",
): SiteYearlyExpense[] => {
  const surfaceInHectare = convertSquareMetersToHectares(surfaceArea);
  return [
    {
      bearer,
      purpose: "rent",
      amount: roundTo2Digits(
        EXPENSES_EURO_PER_HECTARE_PER_YEAR[operationActivity].rent * surfaceInHectare,
      ),
    },
    {
      bearer,
      purpose: "operationsTaxes",
      amount: roundTo2Digits(
        EXPENSES_EURO_PER_HECTARE_PER_YEAR[operationActivity].operationsTaxes * surfaceInHectare,
      ),
    },
    {
      bearer,
      purpose: "otherOperationsCosts",
      amount: roundTo2Digits(
        EXPENSES_EURO_PER_HECTARE_PER_YEAR[operationActivity].otherOperationsCosts *
          surfaceInHectare,
      ),
    },
  ];
};
