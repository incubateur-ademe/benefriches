import {
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

export type StepGroupId =
  | "CREATION_MODE"
  | "USES"
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
  | "PROJECT_PROGRESS"
  | "NAMING"
  | "SUMMARY";

export type StepSubGroupId =
  | "USES_SELECTION"
  | "USES_GREEN_SPACES_AREA"
  | "USES_FLOOR_AREA"
  | "SPACES_SELECTION"
  | "SPACES_GREEN_SPACES_SOILS"
  | "SPACES_SURFACES"
  | "RESIDENTIAL_SPACES"
  | "GREEN_SPACES"
  | "PUBLIC_SPACES"
  | "SOILS_SUMMARY"
  | "DECONTAMINATION_SELECTION"
  | "DECONTAMINATION_SURFACE"
  | "CARBON_STORAGE"
  | "FLOOR_SURFACE"
  | "BUILDINGS_USE_SELECTION"
  | "BUILDINGS_USE_SURFACES"
  | "STAKEHOLDERS_PROJECT_DEVELOPER"
  | "STAKEHOLDERS_REINSTATEMENT_OWNER"
  | "EXPENSES_SITE_PURCHASE"
  | "EXPENSES_SITE_REINSTATEMENT"
  | "EXPENSES_SITE_INSTALLATION"
  | "EXPENSES_BUILDINGS_OPERATION"
  | "REVENUE_BUILDINGS_OPERATION"
  | "REVENUE_FINANCIAL_ASSISTANCE"
  | "REVENUE_SITE_RESALE"
  | "REVENUE_BUILDINGS_RESALE"
  | "SITE_CESSION"
  | "BUILDINGS_CESSION";

export const STEP_GROUP_LABELS: Record<StepGroupId | StepSubGroupId, string> = {
  CREATION_MODE: "Mode de création",

  // Uses flow (new)
  USES: "Usages",
  USES_SELECTION: "Choix des usages",
  USES_GREEN_SPACES_AREA: "Espaces verts publics",
  USES_FLOOR_AREA: "Surfaces de plancher",

  // Spaces flow (new)
  SPACES_GREEN_SPACES_SOILS: "Sols des espaces verts publics",

  // Groupes (legacy spaces flow)
  SPACES: "Espaces",
  SPACES_SELECTION: "Choix des espaces",
  SPACES_SURFACES: "Surfaces",
  SPACES_DEVELOPMENT: "Aménagement",
  RESIDENTIAL_SPACES: "Lieux d'habitation et d'activité",
  GREEN_SPACES: "Espaces verts",
  PUBLIC_SPACES: "Espaces publics",
  SOILS_SUMMARY: "Récapitulatif des sols",
  CARBON_STORAGE: "Stockage de carbone",
  SOILS_DECONTAMINATION: "Dépollution",
  DECONTAMINATION_SELECTION: "Choix de dépolluer",
  DECONTAMINATION_SURFACE: "Surface",
  BUILDINGS: "Bâtiments",
  FLOOR_SURFACE: "Surface de plancher",
  BUILDINGS_USE: "Usages",
  BUILDINGS_USE_SELECTION: "Choix des usages",
  BUILDINGS_USE_SURFACES: "Surfaces",

  STAKEHOLDERS: "Acteurs",
  STAKEHOLDERS_PROJECT_DEVELOPER: "Aménageur",
  STAKEHOLDERS_REINSTATEMENT_OWNER: "Maître d'ouvrage",

  SITE_RESALE: "Cession foncière",
  SITE_CESSION: "Cession du site",
  BUILDINGS_CESSION: "Revente des bâtiments",

  EXPENSES: "Dépenses",
  EXPENSES_SITE_PURCHASE: "Acquisition du site",
  EXPENSES_SITE_REINSTATEMENT: "Remise en état",
  EXPENSES_SITE_INSTALLATION: "Aménagement",
  EXPENSES_BUILDINGS_OPERATION: "Exploitation des bâtiments",

  REVENUE: "Recettes",
  REVENUE_BUILDINGS_OPERATION: "Exploitation des bâtiments",
  REVENUE_FINANCIAL_ASSISTANCE: "Aides financières",
  REVENUE_SITE_RESALE: "Revente du site",
  REVENUE_BUILDINGS_RESALE: "Revente des bâtiments",

  SCHEDULE: "Calendrier",
  PROJECT_PROGRESS: "Avancement",

  NAMING: "Dénomination",

  SUMMARY: "Récapitulatif",
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
  // Uses flow (new)
  URBAN_PROJECT_USES_INTRODUCTION: { groupId: "USES" },
  URBAN_PROJECT_USES_SELECTION: { groupId: "USES", subGroupId: "USES_SELECTION" },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
    groupId: "USES",
    subGroupId: "USES_GREEN_SPACES_AREA",
  },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: {
    groupId: "SPACES",
    subGroupId: "SPACES_GREEN_SPACES_SOILS",
  },
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
    groupId: "SPACES",
    subGroupId: "SPACES_GREEN_SPACES_SOILS",
  },
  URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: { groupId: "USES", subGroupId: "USES_FLOOR_AREA" },
  // Espaces (new uses flow)
  URBAN_PROJECT_SPACES_INTRODUCTION: { groupId: "SPACES" },
  URBAN_PROJECT_SPACES_SELECTION: { groupId: "SPACES", subGroupId: "SPACES_SELECTION" },
  URBAN_PROJECT_SPACES_SURFACE_AREA: { groupId: "SPACES", subGroupId: "SPACES_SURFACES" },
  // Espaces (legacy)
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: { groupId: "SPACES" },
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: { groupId: "SPACES", subGroupId: "SPACES_SELECTION" },
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
    groupId: "SPACES",
    subGroupId: "SPACES_SURFACES",
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
    subGroupId: "DECONTAMINATION_SELECTION",
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
    groupId: "SOILS_DECONTAMINATION",
    subGroupId: "DECONTAMINATION_SURFACE",
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
    subGroupId: "BUILDINGS_USE_SELECTION",
  },
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
    groupId: "BUILDINGS_USE",
    subGroupId: "BUILDINGS_USE_SURFACES",
  },

  // Acteurs
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: { groupId: "STAKEHOLDERS" },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    groupId: "STAKEHOLDERS",
    subGroupId: "STAKEHOLDERS_PROJECT_DEVELOPER",
  },
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    groupId: "STAKEHOLDERS",
    subGroupId: "STAKEHOLDERS_REINSTATEMENT_OWNER",
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
    subGroupId: "EXPENSES_SITE_PURCHASE",
  },
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
    groupId: "EXPENSES",
    subGroupId: "EXPENSES_SITE_REINSTATEMENT",
  },
  URBAN_PROJECT_EXPENSES_INSTALLATION: {
    groupId: "EXPENSES",
    subGroupId: "EXPENSES_SITE_INSTALLATION",
  },
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
    groupId: "EXPENSES",
    subGroupId: "EXPENSES_BUILDINGS_OPERATION",
  },

  // Recettes
  URBAN_PROJECT_REVENUE_INTRODUCTION: { groupId: "REVENUE" },
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
    groupId: "REVENUE",
    subGroupId: "REVENUE_SITE_RESALE",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
    groupId: "REVENUE",
    subGroupId: "REVENUE_BUILDINGS_RESALE",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
    groupId: "REVENUE",
    subGroupId: "REVENUE_BUILDINGS_OPERATION",
  },
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: {
    groupId: "REVENUE",
    subGroupId: "REVENUE_FINANCIAL_ASSISTANCE",
  },

  // Calendrier et avancement
  URBAN_PROJECT_SCHEDULE_PROJECTION: {
    groupId: "SCHEDULE",
  },
  URBAN_PROJECT_PROJECT_PHASE: { groupId: "PROJECT_PROGRESS" },

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
