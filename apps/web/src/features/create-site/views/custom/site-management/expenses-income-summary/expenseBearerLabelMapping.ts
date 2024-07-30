import { Expense } from "@/features/create-site/domain/siteFoncier.types";

export const getLabelForExpenseBearer = (
  expenseBearer: Expense["bearer"],
  siteData: { ownerName?: string; tenantName?: string; isFriche: boolean },
): string => {
  switch (expenseBearer) {
    case "owner":
      return siteData.ownerName ?? "Propriétaire du site";
    case "tenant":
      return (
        siteData.tenantName ?? (siteData.isFriche ? "Locataire de la friche" : "Exploitant du site")
      );
  }
};
