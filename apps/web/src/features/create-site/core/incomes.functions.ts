import { SiteYearlyIncome } from "shared";

export const getLabelForIncomeSource = (source: SiteYearlyIncome["source"]): string => {
  switch (source) {
    case "operations":
      return "Revenus d'exploitation";
    case "product-sales":
      return "Vente de produits";
    case "other":
      return "Autres revenus d'exploitation";
    case "subsidies":
      return "Subventions";
    case "rent":
      return "Loyer";
  }
};
