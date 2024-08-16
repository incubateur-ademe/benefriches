import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpensePurpose,
} from "shared";

export type RenewableEnergyDevelopmentPlanType =
  | "PHOTOVOLTAIC_POWER_PLANT"
  | "AGRIVOLTAIC"
  | "GEOTHERMAL"
  | "BIOMASS";

export type WorksSchedule = {
  startDate: string;
  endDate: string;
};

export const getLabelForRecurringExpense = (
  expensePurpose: RecurringExpense["purpose"],
): string => {
  switch (expensePurpose) {
    case "taxes":
      return "Impôts et taxes";
    case "other":
      return "Autres dépenses";
    case "rent":
      return "Loyer";
    case "maintenance":
      return "Maintenance";
  }
};
export const getLabelForRecurringRevenueSource = (
  revenueSource: RecurringRevenue["source"],
): string => {
  switch (revenueSource) {
    case "operations":
      return "Recettes d'exploitation";
    case "other":
      return "Autres recettes";
    case "rent":
      return "Loyer";
  }
};

export const getLabelForFinancialAssistanceRevenueSource = (
  financialAssitanceSource: FinancialAssistanceRevenue["source"],
): string => {
  switch (financialAssitanceSource) {
    case "local_or_regional_authority_participation":
      return "Participation des collectivités";
    case "public_subsidies":
      return "Subventions publiques";
    case "other":
      return "Autres ressources";
  }
};

export const getLabelForPhotovoltaicInstallationExpensePurpose = (
  expensePurpose: PhotovoltaicInstallationExpense["purpose"],
): string => {
  switch (expensePurpose) {
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "installation_works":
      return "🛠 Travaux d'installation des panneaux";
    case "other":
      return "⚡️ Autres frais d'installation des panneaux";
  }
};

export const getLabelForReinstatementExpensePurpose = (
  expensePurpose: ReinstatementExpensePurpose,
): string => {
  switch (expensePurpose) {
    case "asbestos_removal":
      return "☣️ Désamiantage";
    case "sustainable_soils_reinstatement":
      return "🌱 Restauration écologique";
    case "deimpermeabilization":
      return "🌧 Désimperméabilisation";
    case "remediation":
      return "✨ Dépollution des sols";
    case "demolition":
      return "🧱 Déconstruction";
    case "waste_collection":
      return "♻️ Évacuation et traitement des déchets";
    default:
      return "🏗 Autres dépenses de remise en état";
  }
};
