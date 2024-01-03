import { Expense } from "@/features/create-site/domain/siteFoncier.types";

export const getLabelForExpenseCategory = (expenseCategory: Expense["category"]): string => {
  switch (expenseCategory) {
    case "rent":
      return "Loyer";
    case "safety":
      return "Sécurisation du site";
    case "taxes":
      return "Taxes";
    case "soils_degradation":
      return "Dégradation des sols";
    case "other":
      return "Autres";
  }
};
