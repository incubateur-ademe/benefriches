import {
  SiteYearlyExpense,
  SiteManagementYearlyExpensePurpose,
  SiteSecurityYearlyExpensePurpose,
} from "shared";

export const getLabelForExpensePurpose = (expensePurpose: SiteYearlyExpense["purpose"]): string => {
  switch (expensePurpose) {
    case "propertyTaxes":
      return "Taxe foncière";
    case "operationsTaxes":
      return "Charges fiscales d'exploitation";
    case "rent":
      return "Loyer";
    case "otherOperationsCosts":
      return "Autres charges d'exploitation";
    case "accidentsCost":
      return "Accidents";
    case "illegalDumpingCost":
      return "Débarras de dépôt sauvage";
    case "maintenance":
      return "Entretien du site";
    case "otherManagementCosts":
      return "Autre dépenses de gestion du site";
    case "security":
      return "Gardiennage";
    case "otherSecuringCosts":
      return "Autres frais de sécurisation";
  }
};

export type SiteYearlyExpensesConfig = {
  purpose: SiteManagementYearlyExpensePurpose | SiteSecurityYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];

export type SiteManagementYearlyExpensesConfig = {
  purpose: SiteManagementYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];

export const getFricheManagementExpensesConfig = (input: {
  hasTenant: boolean;
}): SiteManagementYearlyExpensesConfig => {
  const { hasTenant } = input;

  if (hasTenant) {
    return [
      { purpose: "rent", fixedBearer: "tenant" },
      { purpose: "maintenance", fixedBearer: "tenant" },
      { purpose: "propertyTaxes", fixedBearer: "owner" },
      { purpose: "otherManagementCosts", fixedBearer: null },
    ];
  }
  return [
    { purpose: "maintenance", fixedBearer: "owner" },
    { purpose: "propertyTaxes", fixedBearer: "owner" },
    { purpose: "otherManagementCosts", fixedBearer: "owner" },
  ];
};

export type FricheSecurityYearlyExpensesConfig = {
  purpose: SiteSecurityYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];
export const getFricheSecurityExpensesConfig = (input: {
  hasTenant: boolean;
  hasRecentAccidents: boolean;
}): FricheSecurityYearlyExpensesConfig => {
  const { hasTenant, hasRecentAccidents } = input;
  const expensesBearer = hasTenant ? null : "owner";
  const expenses: FricheSecurityYearlyExpensesConfig = [
    { purpose: "security", fixedBearer: expensesBearer },
    { purpose: "illegalDumpingCost", fixedBearer: expensesBearer },
    { purpose: "otherSecuringCosts", fixedBearer: expensesBearer },
  ];

  if (hasRecentAccidents) {
    expenses.push({ purpose: "accidentsCost", fixedBearer: expensesBearer });
  }
  return expenses;
};

export const getAgriculturalOperationExpensesConfig = ({
  isOperated,
  isOperatedByOwner,
}: {
  isOperated: boolean;
  isOperatedByOwner: boolean;
}): SiteManagementYearlyExpensesConfig => {
  if (!isOperated) {
    return [{ purpose: "propertyTaxes", fixedBearer: "owner" }];
  }

  if (isOperatedByOwner) {
    return [
      { purpose: "propertyTaxes", fixedBearer: "owner" },
      { purpose: "operationsTaxes", fixedBearer: "owner" },
      { purpose: "otherOperationsCosts", fixedBearer: "owner" },
    ];
  }

  return [
    { purpose: "rent", fixedBearer: "tenant" },
    { purpose: "operationsTaxes", fixedBearer: "tenant" },
    { purpose: "otherOperationsCosts", fixedBearer: "tenant" },
    { purpose: "propertyTaxes", fixedBearer: "owner" },
  ];
};
