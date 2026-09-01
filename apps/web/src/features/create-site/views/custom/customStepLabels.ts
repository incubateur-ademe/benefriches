import type { CustomAnswerStepId } from "@/features/create-site/core/custom/customSteps";

/**
 * Dialog labels for every custom-flow answer step, in the project side's "Groupe → Étape"
 * style (see `AnswerCascadingUpdateDialog`'s `getStepLabel`). Used by the cascading-changes
 * confirmation dialog to name the steps an address change would invalidate.
 *
 * Typed as a total `Record` (not `Partial`) so a step added to `CUSTOM_ANSWER_STEP_IDS` without
 * a label here is a compile error, not a silently blank dialog line.
 *
 * Deliberately NOT derived from `getCurrentStepCategory` (Stepper.tsx): that mapping collapses
 * OWNER/TENANT/OPERATOR to a single "Gestion du site" category, which would render duplicate
 * lines in the dialog when several stakeholder steps are invalidated at once.
 */
export const CUSTOM_STEP_DIALOG_LABELS: Record<CustomAnswerStepId, string> = {
  FRICHE_ACTIVITY: "Introduction → Activité de la friche",
  AGRICULTURAL_OPERATION_ACTIVITY: "Introduction → Activité agricole",
  NATURAL_AREA_TYPE: "Introduction → Type d'espace naturel",
  URBAN_ZONE_TYPE: "Introduction → Type de zone urbaine",
  ADDRESS: "Adresse",
  SURFACE_AREA: "Espaces → Surface",
  SPACES_KNOWLEDGE: "Espaces → Connaissance des espaces",
  SPACES_SELECTION: "Espaces → Sélection des espaces",
  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: "Espaces → Connaissance de la répartition",
  SPACES_SURFACE_AREA_DISTRIBUTION: "Espaces → Répartition des surfaces",
  SOILS_CONTAMINATION: "Pollution et accidents → Pollution des sols",
  FRICHE_ACCIDENTS: "Pollution et accidents → Accidents",
  OWNER: "Gestion du site → Propriétaire",
  IS_FRICHE_LEASED: "Gestion du site → Friche louée",
  IS_SITE_OPERATED: "Gestion du site → Site exploité",
  TENANT: "Gestion du site → Locataire",
  OPERATOR: "Gestion du site → Exploitant",
  YEARLY_EXPENSES: "Gestion du site → Dépenses annuelles",
  YEARLY_INCOME: "Gestion du site → Recettes annuelles",
  NAMING: "Dénomination → Nom du site",
};

export const getCustomStepDialogLabel = (stepId: CustomAnswerStepId): string =>
  CUSTOM_STEP_DIALOG_LABELS[stepId];
