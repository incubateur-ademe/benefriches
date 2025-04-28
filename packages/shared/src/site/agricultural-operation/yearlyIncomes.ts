import { roundTo2Digits } from "../../services";
import { convertSquareMetersToHectares } from "../../surface-area";
import { SiteYearlyIncome } from "../yearlyIncome";
import { AgriculturalOperationActivity } from "./operationActivity";

const INCOMES_EURO_PER_HECTARE_PER_YEAR = {
  CATTLE_FARMING: {
    subsidies: 410,
    productSales: 2040,
    other: 160,
  },
  CEREALS_AND_OILSEEDS_CULTIVATION: {
    subsidies: 270,
    productSales: 1350,
    other: 70,
  },
  LARGE_VEGETABLE_CULTIVATION: {
    subsidies: 360,
    productSales: 3020,
    other: 230,
  },
  MARKET_GARDENING: {
    subsidies: 1160,
    productSales: 21630,
    other: 880,
  },
  FLOWERS_AND_HORTICULTURE: {
    subsidies: 630,
    productSales: 37550,
    other: 1660,
  },
  VITICULTURE: {
    subsidies: 380,
    productSales: 9330,
    other: 1260,
  },
  FRUITS_AND_OTHER_PERMANENT_CROPS: {
    subsidies: 1190,
    productSales: 6390,
    other: 550,
  },
  PIG_FARMING: {
    subsidies: 370,
    productSales: 12960,
    other: 360,
  },
  POULTRY_FARMING: {
    subsidies: 450,
    productSales: 4900,
    other: 350,
  },
  SHEEP_AND_GOAT_FARMING: {
    subsidies: 490,
    productSales: 1120,
    other: 70,
  },
  POLYCULTURE_AND_LIVESTOCK: {
    subsidies: 390,
    productSales: 2250,
    other: 180,
  },
};

export const computeAgriculturalOperationYearlyIncomes = (
  operationActivity: AgriculturalOperationActivity,
  surfaceArea: number,
): SiteYearlyIncome[] => {
  const surfaceInHectare = convertSquareMetersToHectares(surfaceArea);
  return [
    {
      source: "subsidies",
      amount: roundTo2Digits(
        INCOMES_EURO_PER_HECTARE_PER_YEAR[operationActivity].subsidies * surfaceInHectare,
      ),
    },
    {
      source: "product-sales",
      amount: roundTo2Digits(
        INCOMES_EURO_PER_HECTARE_PER_YEAR[operationActivity].productSales * surfaceInHectare,
      ),
    },
    {
      source: "other",
      amount: roundTo2Digits(
        INCOMES_EURO_PER_HECTARE_PER_YEAR[operationActivity].other * surfaceInHectare,
      ),
    },
  ];
};
