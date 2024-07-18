import { z } from "zod";

export const developmentPlanCategorySchema = z.enum([
  "RENEWABLE_ENERGY",
  "MIXED_USE_NEIGHBOURHOOD",
  "URBAN_AGRICULTURE",
  "NATURAL_URBAN_SPACES",
  "COMMERCIAL_ACTIVITY_AREA",
]);
export type DevelopmentPlanCategory = z.infer<typeof developmentPlanCategorySchema>;

export type RenewableEnergyDevelopmentPlanType =
  | "PHOTOVOLTAIC_POWER_PLANT"
  | "AGRIVOLTAIC"
  | "GEOTHERMAL"
  | "BIOMASS";

export type ProjectPhase =
  | "setup"
  | "planning"
  | "design"
  | "construction"
  | "completed"
  | "unknown";

export type ProjectPhaseDetails =
  | "setup_opportunity_and_feasibility_analysis"
  | "setup_scenario_selection_and_implementation"
  | "design_preliminary_draft"
  | "design_final_draft"
  | "design_pro_or_permit_filing_or_contract_awarding";

export type ReinstatementExpensePurpose =
  | "asbestos_removal"
  | "deimpermeabilization"
  | "demolition"
  | "other_reinstatement"
  | "remediation"
  | "sustainable_soils_reinstatement"
  | "waste_collection";

export type ReinstatementExpense = { purpose: ReinstatementExpensePurpose; amount: number };

export type PhotovoltaicInstallationExpense = {
  amount: number;
  purpose: "technical_studies" | "installation_works" | "other";
};

export type FinancialAssistanceRevenue = {
  amount: number;
  source: "local_or_regional_authority_participation" | "public_subsidies" | "other";
};

export type RecurringExpense = {
  amount: number;
  purpose: "rent" | "maintenance" | "taxes" | "other";
};

export type RecurringRevenue = {
  amount: number;
  source: "operations" | "other";
};

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
