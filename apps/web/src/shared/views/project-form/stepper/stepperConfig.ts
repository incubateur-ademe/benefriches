import {
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

export type StepGroupId =
  | "CREATION_MODE"
  | "SPACES"
  | "SPACES_DEVELOPMENT"
  | "SOILS_DECONTAMINATION"
  | "BUILDINGS"
  | "BUILDINGS_USE"
  | "STAKEHOLDERS"
  | "SITE_RESALE"
  | "EXPENSES"
  | "REVENUE"
  | "SCHEDULE"
  | "NAMING"
  | "SUMMARY";

export type StepSubGroupId =
  | "SELECTION"
  | "SURFACE"
  | "RESIDENTIAL_SPACES"
  | "GREEN_SPACES"
  | "PUBLIC_SPACES"
  | "SOILS_SUMMARY"
  | "CARBON_STORAGE"
  | "FLOOR_SURFACE"
  | "SURFACE_DISTRIBUTION"
  | "PROJECT_DEVELOPER"
  | "REINSTATEMENT_OWNER"
  | "SITE_PURCHASE"
  | "SITE_REINSTATEMENT"
  | "SITE_INSTALLATION"
  | "BUILDINGS_OPERATION"
  | "FINANCIAL_ASSISTANCE"
  | "SITE_RESALE_SUB"
  | "BUILDINGS_RESALE"
  | "SCHEDULE_SUB"
  | "PROJECT_PROGRESS"
  | "SITE_CESSION"
  | "BUILDINGS_CESSION";

export const STEP_GROUP_LABELS: Record<StepGroupId | StepSubGroupId, string> = {
  CREATION_MODE: "Mode de création",

  // Groupes
  SPACES: "Espaces",
  SPACES_DEVELOPMENT: "Aménagement des espaces",
  SOILS_DECONTAMINATION: "Dépollution des sols",
  BUILDINGS: "Bâtiments",
  BUILDINGS_USE: "Usage des lieux d'habitation et d'activité",
  STAKEHOLDERS: "Acteurs",
  SITE_RESALE: "Cession foncière",
  EXPENSES: "Dépenses",
  REVENUE: "Recettes",
  SCHEDULE: "Calendrier et avancement",
  NAMING: "Dénomination",
  SUMMARY: "Récapitulatif",

  // Sous-groupes
  SELECTION: "Sélection",
  SURFACE: "Surface",
  RESIDENTIAL_SPACES: "Lieux d'habitation et d'activité",
  GREEN_SPACES: "Espaces verts",
  PUBLIC_SPACES: "Espaces publics",
  SOILS_SUMMARY: "Récapitulatif des sols",
  CARBON_STORAGE: "Stockage de carbone",
  FLOOR_SURFACE: "Surface de plancher",
  SURFACE_DISTRIBUTION: "Distribution des surfaces",
  PROJECT_DEVELOPER: "Aménageur",
  REINSTATEMENT_OWNER: "Maître d'ouvrage de la remise en état",
  SITE_PURCHASE: "Achat du site",
  SITE_REINSTATEMENT: "Remise en état du site",
  SITE_INSTALLATION: "Aménagement du site",
  BUILDINGS_OPERATION: "Exploitation des bâtiments",
  FINANCIAL_ASSISTANCE: "Subventions",
  SITE_RESALE_SUB: "Revente du site",
  BUILDINGS_RESALE: "Revente des bâtiments",
  SCHEDULE_SUB: "Calendrier",
  PROJECT_PROGRESS: "Avancement",
  SITE_CESSION: "Cession du site",
  BUILDINGS_CESSION: "Cession des bâtiments",
} as const;

type StepToGroupMapping = Record<
  UrbanProjectCreationStep,
  { groupId: StepGroupId; subGroupId?: StepSubGroupId }
>;
export const STEP_TO_GROUP_MAPPING: StepToGroupMapping = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: { groupId: "CREATION_MODE" },
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: { groupId: "CREATION_MODE" },
  URBAN_PROJECT_EXPRESS_SUMMARY: { groupId: "SUMMARY" },
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: { groupId: "SUMMARY" },
  // Espaces
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: { groupId: "SPACES" },
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: { groupId: "SPACES", subGroupId: "SELECTION" },
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
    groupId: "SPACES",
    subGroupId: "SURFACE",
  },

  // Aménagement des espaces
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: { groupId: "SPACES_DEVELOPMENT" },
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "GREEN_SPACES",
  },
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "GREEN_SPACES",
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "RESIDENTIAL_SPACES",
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "RESIDENTIAL_SPACES",
  },
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "PUBLIC_SPACES",
  },
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "PUBLIC_SPACES",
  },
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "SOILS_SUMMARY",
  },
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: {
    groupId: "SPACES_DEVELOPMENT",
    subGroupId: "CARBON_STORAGE",
  },

  // Dépollution des sols
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: { groupId: "SOILS_DECONTAMINATION" },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
    groupId: "SOILS_DECONTAMINATION",
    subGroupId: "SELECTION",
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
    groupId: "SOILS_DECONTAMINATION",
    subGroupId: "SURFACE",
  },

  // Bâtiments
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: { groupId: "BUILDINGS" },
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
    groupId: "BUILDINGS",
    subGroupId: "FLOOR_SURFACE",
  },

  // Usage des lieux d'habitation et d'activité
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: {
    groupId: "BUILDINGS_USE",
  },
  URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
    groupId: "BUILDINGS_USE",
    subGroupId: "SELECTION",
  },
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
    groupId: "BUILDINGS_USE",
    subGroupId: "SURFACE_DISTRIBUTION",
  },

  // Acteurs
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: { groupId: "STAKEHOLDERS" },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    groupId: "STAKEHOLDERS",
    subGroupId: "PROJECT_DEVELOPER",
  },
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    groupId: "STAKEHOLDERS",
    subGroupId: "REINSTATEMENT_OWNER",
  },

  // Cession foncière
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: { groupId: "SITE_RESALE" },
  URBAN_PROJECT_SITE_RESALE_SELECTION: {
    groupId: "SITE_RESALE",
    subGroupId: "SITE_CESSION",
  },
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
    groupId: "SITE_RESALE",
    subGroupId: "BUILDINGS_CESSION",
  },

  // Dépenses
  URBAN_PROJECT_EXPENSES_INTRODUCTION: { groupId: "EXPENSES" },
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: {
    groupId: "EXPENSES",
    subGroupId: "SITE_PURCHASE",
  },
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
    groupId: "EXPENSES",
    subGroupId: "SITE_REINSTATEMENT",
  },
  URBAN_PROJECT_EXPENSES_INSTALLATION: {
    groupId: "EXPENSES",
    subGroupId: "SITE_INSTALLATION",
  },
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
    groupId: "EXPENSES",
    subGroupId: "BUILDINGS_OPERATION",
  },

  // Recettes
  URBAN_PROJECT_REVENUE_INTRODUCTION: { groupId: "REVENUE" },
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
    groupId: "REVENUE",
    subGroupId: "SITE_RESALE_SUB",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
    groupId: "REVENUE",
    subGroupId: "BUILDINGS_RESALE",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
    groupId: "REVENUE",
    subGroupId: "BUILDINGS_OPERATION",
  },
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: {
    groupId: "REVENUE",
    subGroupId: "FINANCIAL_ASSISTANCE",
  },

  // Calendrier et avancement
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: { groupId: "SCHEDULE" },
  URBAN_PROJECT_SCHEDULE_PROJECTION: {
    groupId: "SCHEDULE",
    subGroupId: "SCHEDULE_SUB",
  },
  URBAN_PROJECT_PROJECT_PHASE: { groupId: "SCHEDULE", subGroupId: "PROJECT_PROGRESS" },

  // Final
  URBAN_PROJECT_NAMING: { groupId: "NAMING" },
  URBAN_PROJECT_FINAL_SUMMARY: { groupId: "SUMMARY" },
  URBAN_PROJECT_CREATION_RESULT: { groupId: "SUMMARY" },
};

export type ProjectStepGroups = Record<
  StepGroupId,
  { stepId: UrbanProjectCreationStep; subGroupId?: StepSubGroupId; isStepCompleted: boolean }[]
>;
export const buildStepGroupsFromSequence = <
  T extends UrbanProjectCreationStep = UrbanProjectCreationStep,
>(
  stepSequence: { stepId: T; isCompleted: boolean }[],
) => {
  const stepGroups = {} as ProjectStepGroups;

  for (const { stepId, isCompleted: isStepCompleted } of stepSequence.filter(
    ({ stepId }) => isAnswersStep(stepId) || isSummaryStep(stepId),
  )) {
    const { groupId, subGroupId } = STEP_TO_GROUP_MAPPING[stepId];

    if (!stepGroups[groupId]) {
      stepGroups[groupId] = [];
    }

    stepGroups[groupId].push({
      stepId: stepId,
      subGroupId: subGroupId,
      isStepCompleted,
    });
  }

  return stepGroups;
};
