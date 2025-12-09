import z from "zod";

import { TRevenue } from "../../financial";

export const yearlyBuildingsOperationsRevenuePurposeSchema = z.enum(["rent", "other"]);
export type YearlyBuildingsOperationsRevenues = TRevenue<
  z.infer<typeof yearlyBuildingsOperationsRevenuePurposeSchema>
>;

export const getLabelForYearlyBuildingsOperationsRevenues = (
  revenueSource: YearlyBuildingsOperationsRevenues["source"],
): string => {
  switch (revenueSource) {
    case "rent":
      return "Revenu locatif";
    case "other":
      return "Autres recettes";
  }
};
