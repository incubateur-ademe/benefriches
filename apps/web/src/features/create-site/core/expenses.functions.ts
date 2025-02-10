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

export type SiteYearlyExpensesBaseConfig = {
  purpose: SiteManagementYearlyExpensePurpose | SiteSecurityYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];

export type SiteManagementYearlyExpensesBaseConfig = {
  purpose: SiteManagementYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];
export const getSiteManagementExpensesBaseConfig = (input: {
  hasTenant: boolean;
  isOperated: boolean;
}): SiteManagementYearlyExpensesBaseConfig => {
  const { hasTenant, isOperated } = input;

  if (hasTenant) {
    return [
      { purpose: "rent", fixedBearer: "tenant" },
      ...(isOperated
        ? ([
            { purpose: "operationsTaxes", fixedBearer: "tenant" },
          ] as SiteManagementYearlyExpensesBaseConfig)
        : []),
      { purpose: "maintenance", fixedBearer: "tenant" },
      { purpose: "propertyTaxes", fixedBearer: "owner" },
      { purpose: "otherManagementCosts", fixedBearer: null },
    ];
  }
  return [
    ...(isOperated
      ? ([
          { purpose: "operationsTaxes", fixedBearer: "owner" },
        ] as SiteManagementYearlyExpensesBaseConfig)
      : []),
    { purpose: "maintenance", fixedBearer: "owner" },
    { purpose: "propertyTaxes", fixedBearer: "owner" },
    { purpose: "otherManagementCosts", fixedBearer: "owner" },
  ];
};

export type SiteSecurityYearlyExpensesBaseConfig = {
  purpose: SiteSecurityYearlyExpensePurpose;
  fixedBearer: "owner" | "tenant" | null;
}[];
export const getSiteSecurityExpensesBaseConfig = (input: {
  hasTenant: boolean;
  hasRecentAccidents: boolean;
}): SiteSecurityYearlyExpensesBaseConfig => {
  const { hasTenant, hasRecentAccidents } = input;
  const expensesBearer = hasTenant ? null : "owner";
  const expenses: SiteSecurityYearlyExpensesBaseConfig = [
    { purpose: "security", fixedBearer: expensesBearer },
    { purpose: "illegalDumpingCost", fixedBearer: expensesBearer },
    { purpose: "otherSecuringCosts", fixedBearer: expensesBearer },
  ];

  if (hasRecentAccidents) {
    expenses.push({ purpose: "accidentsCost", fixedBearer: expensesBearer });
  }
  return expenses;
};
