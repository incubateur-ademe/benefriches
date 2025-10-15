import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";

export const STEP_LABELS = {
  // Catégories principales
  CREATION_MODE: "Mode de création",

  // custom
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

  // Sous-catégories
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

export type SubCategoryDefinition = {
  targetStepId: UrbanProjectCreationStep;
  labelKey: keyof typeof STEP_LABELS;
};

export type CategoryDefinition = {
  labelKey: keyof typeof STEP_LABELS;
  targetStepId: UrbanProjectCreationStep;
  subCategories?: SubCategoryDefinition[];
};

// Configuration des étapes affichées dans le Stepper
// définit l'ordre d'affichage
export const STEP_CATEGORIES: CategoryDefinition[] = [
  {
    labelKey: "CREATION_MODE",
    targetStepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
  },
  {
    labelKey: "SPACES",
    targetStepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", labelKey: "SELECTION" },
      { targetStepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", labelKey: "SURFACE" },
    ],
  },
  {
    labelKey: "SPACES_DEVELOPMENT",
    targetStepId: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
    subCategories: [
      {
        targetStepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
        labelKey: "RESIDENTIAL_SPACES",
      },
      {
        targetStepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
        labelKey: "GREEN_SPACES",
      },
      { targetStepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION", labelKey: "PUBLIC_SPACES" },
      { targetStepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY", labelKey: "SOILS_SUMMARY" },
      { targetStepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY", labelKey: "CARBON_STORAGE" },
    ],
  },
  {
    labelKey: "SOILS_DECONTAMINATION",
    targetStepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION", labelKey: "SELECTION" },
      { targetStepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA", labelKey: "SURFACE" },
    ],
  },
  {
    labelKey: "BUILDINGS",
    targetStepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", labelKey: "FLOOR_SURFACE" },
    ],
  },
  {
    labelKey: "BUILDINGS_USE",
    targetStepId: "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
    subCategories: [
      {
        targetStepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
        labelKey: "SURFACE_DISTRIBUTION",
      },
    ],
  },
  {
    labelKey: "STAKEHOLDERS",
    targetStepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
    subCategories: [
      {
        targetStepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        labelKey: "PROJECT_DEVELOPER",
      },
      {
        targetStepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        labelKey: "REINSTATEMENT_OWNER",
      },
    ],
  },
  {
    labelKey: "SITE_RESALE",
    targetStepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_SITE_RESALE_SELECTION", labelKey: "SITE_CESSION" },
      { targetStepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", labelKey: "BUILDINGS_CESSION" },
    ],
  },
  {
    labelKey: "EXPENSES",
    targetStepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS", labelKey: "SITE_PURCHASE" },
      { targetStepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT", labelKey: "SITE_REINSTATEMENT" },
      { targetStepId: "URBAN_PROJECT_EXPENSES_INSTALLATION", labelKey: "SITE_INSTALLATION" },
      {
        targetStepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
        labelKey: "BUILDINGS_OPERATION",
      },
    ],
  },
  {
    labelKey: "REVENUE",
    targetStepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",
    subCategories: [
      {
        targetStepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
        labelKey: "FINANCIAL_ASSISTANCE",
      },
      {
        targetStepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
        labelKey: "BUILDINGS_OPERATION",
      },
      { targetStepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE", labelKey: "SITE_RESALE_SUB" },
      { targetStepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE", labelKey: "BUILDINGS_RESALE" },
    ],
  },
  {
    labelKey: "SCHEDULE",
    targetStepId: "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
    subCategories: [
      { targetStepId: "URBAN_PROJECT_SCHEDULE_PROJECTION", labelKey: "SCHEDULE_SUB" },
      { targetStepId: "URBAN_PROJECT_PROJECT_PHASE", labelKey: "PROJECT_PROGRESS" },
    ],
  },
  { labelKey: "NAMING", targetStepId: "URBAN_PROJECT_NAMING" },
  { labelKey: "SUMMARY", targetStepId: "URBAN_PROJECT_FINAL_SUMMARY" },
  { labelKey: "SUMMARY", targetStepId: "URBAN_PROJECT_EXPRESS_SUMMARY" },
];

// Mapping d'une étape (du state) vers la categorie et sous catégorie du Stepper
// Plusieurs étapes du stepper peuvent renvoyer vers le même couple catégorie / sous catégorie
// ex: URBAN_PROJECT_GREEN_SPACES_INTRODUCTION et URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION
export const STEP_TO_CATEGORY_MAPPING: Record<
  UrbanProjectCreationStep,
  { categoryKey: keyof typeof STEP_LABELS; subCategoryKey?: keyof typeof STEP_LABELS }
> = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: { categoryKey: "CREATION_MODE" },
  URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION: { categoryKey: "CREATION_MODE" },
  URBAN_PROJECT_EXPRESS_SUMMARY: { categoryKey: "SUMMARY" },
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: { categoryKey: "SUMMARY" },
  // Espaces
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: { categoryKey: "SPACES" },
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: { categoryKey: "SPACES", subCategoryKey: "SELECTION" },
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
    categoryKey: "SPACES",
    subCategoryKey: "SURFACE",
  },

  // Aménagement des espaces
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: { categoryKey: "SPACES_DEVELOPMENT" },
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "GREEN_SPACES",
  },
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "GREEN_SPACES",
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "RESIDENTIAL_SPACES",
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "RESIDENTIAL_SPACES",
  },
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "PUBLIC_SPACES",
  },
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "PUBLIC_SPACES",
  },
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "SOILS_SUMMARY",
  },
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: {
    categoryKey: "SPACES_DEVELOPMENT",
    subCategoryKey: "CARBON_STORAGE",
  },

  // Dépollution des sols
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: { categoryKey: "SOILS_DECONTAMINATION" },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
    categoryKey: "SOILS_DECONTAMINATION",
    subCategoryKey: "SELECTION",
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
    categoryKey: "SOILS_DECONTAMINATION",
    subCategoryKey: "SURFACE",
  },

  // Bâtiments
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: { categoryKey: "BUILDINGS" },
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
    categoryKey: "BUILDINGS",
    subCategoryKey: "FLOOR_SURFACE",
  },

  // Usage des lieux d'habitation et d'activité
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: {
    categoryKey: "BUILDINGS_USE",
  },
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
    categoryKey: "BUILDINGS_USE",
    subCategoryKey: "SURFACE_DISTRIBUTION",
  },

  // Acteurs
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: { categoryKey: "STAKEHOLDERS" },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    categoryKey: "STAKEHOLDERS",
    subCategoryKey: "PROJECT_DEVELOPER",
  },
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    categoryKey: "STAKEHOLDERS",
    subCategoryKey: "REINSTATEMENT_OWNER",
  },

  // Cession foncière
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: { categoryKey: "SITE_RESALE" },
  URBAN_PROJECT_SITE_RESALE_SELECTION: {
    categoryKey: "SITE_RESALE",
    subCategoryKey: "SITE_CESSION",
  },
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
    categoryKey: "SITE_RESALE",
    subCategoryKey: "BUILDINGS_CESSION",
  },

  // Dépenses
  URBAN_PROJECT_EXPENSES_INTRODUCTION: { categoryKey: "EXPENSES" },
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: {
    categoryKey: "EXPENSES",
    subCategoryKey: "SITE_PURCHASE",
  },
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
    categoryKey: "EXPENSES",
    subCategoryKey: "SITE_REINSTATEMENT",
  },
  URBAN_PROJECT_EXPENSES_INSTALLATION: {
    categoryKey: "EXPENSES",
    subCategoryKey: "SITE_INSTALLATION",
  },
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
    categoryKey: "EXPENSES",
    subCategoryKey: "BUILDINGS_OPERATION",
  },

  // Recettes
  URBAN_PROJECT_REVENUE_INTRODUCTION: { categoryKey: "REVENUE" },
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
    categoryKey: "REVENUE",
    subCategoryKey: "SITE_RESALE_SUB",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
    categoryKey: "REVENUE",
    subCategoryKey: "BUILDINGS_RESALE",
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
    categoryKey: "REVENUE",
    subCategoryKey: "BUILDINGS_OPERATION",
  },
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: {
    categoryKey: "REVENUE",
    subCategoryKey: "FINANCIAL_ASSISTANCE",
  },

  // Calendrier et avancement
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: { categoryKey: "SCHEDULE" },
  URBAN_PROJECT_SCHEDULE_PROJECTION: {
    categoryKey: "SCHEDULE",
    subCategoryKey: "SCHEDULE_SUB",
  },
  URBAN_PROJECT_PROJECT_PHASE: { categoryKey: "SCHEDULE", subCategoryKey: "PROJECT_PROGRESS" },

  // Final
  URBAN_PROJECT_NAMING: { categoryKey: "NAMING" },
  URBAN_PROJECT_FINAL_SUMMARY: { categoryKey: "SUMMARY" },
  URBAN_PROJECT_CREATION_RESULT: { categoryKey: "SUMMARY" },
};
