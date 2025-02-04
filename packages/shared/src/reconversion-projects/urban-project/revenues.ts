import { TRevenue } from "../../financial";

export type YearlyBuildingsOperationsRevenues = TRevenue<"rent" | "other">;

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
