import { Expense } from "@/features/create-site/domain/siteFoncier.types";

export const getLabelForExpenseBearer = (
  expenseBearer: Expense["bearer"],
  siteData: { ownerName?: string; operatorName?: string },
): string => {
  switch (expenseBearer) {
    case "local_or_regional_authority":
      return "Collectivité";
    case "society":
      return "La société";
    case "owner":
      return siteData.ownerName ?? "Propriétaire du site";
    case "operator":
      return siteData.operatorName ?? "Exploitant du site";
  }
};
