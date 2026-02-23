import { buildingsIntroductionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-introduction/buildingsIntroduction.stepperConfig";
import { buildingsUsesFloorSurfaceAreaStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.stepperConfig";
import { creationModeSelectionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/creation-mode/creation-mode-selection/creationModeSelection.stepperConfig";
import { namingStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/naming/naming/naming.stepperConfig";
import { projectPhaseStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/project-phase/project-phase/projectPhase.stepperConfig";
import { creationResultStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/result/creation-result/creationResult.stepperConfig";
import { scheduleProjectionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/schedule/schedule-projection/scheduleProjection.stepperConfig";
import { soilsCarbonSummaryStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-carbon-summary/soilsCarbonSummary.stepperConfig";
import { soilsDecontaminationIntroductionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-decontamination-introduction/soilsDecontaminationIntroduction.stepperConfig";
import { soilsDecontaminationSelectionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-decontamination-selection/soilsDecontaminationSelection.stepperConfig";
import { soilsDecontaminationSurfaceAreaStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.stepperConfig";
import { soilsSummaryStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-summary/soilsSummary.stepperConfig";
import { publicGreenSpacesIntroductionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/spaces/public-green-spaces-introduction/publicGreenSpacesIntroduction.stepperConfig";
import { publicGreenSpacesSoilsDistributionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/spaces/public-green-spaces-soils-distribution/publicGreenSpacesSoilsDistribution.stepperConfig";
import { spacesIntroductionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/spaces/spaces-introduction/spacesIntroduction.stepperConfig";
import { spacesSelectionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/spaces/spaces-selection/spacesSelection.stepperConfig";
import { spacesSurfaceAreaStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/spaces/spaces-surface-area/spacesSurfaceArea.stepperConfig";
import { finalSummaryStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/summary/final-summary/finalSummary.stepperConfig";
import { usesIntroductionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/uses/introduction/usesIntroduction.stepperConfig";
import { publicGreenSpacesSurfaceAreaStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.stepperConfig";
import { usesSelectionStepperConfig } from "@/shared/core/reducers/project-form/urban-project/step-handlers/uses/selection/usesSelection.stepperConfig";
import {
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

export type StepGroupId =
  | "CREATION_MODE"
  | "USES"
  | "SPACES"
  | "BUILDINGS"
  | "SOILS_DECONTAMINATION"
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
  | "SOILS_SUMMARY"
  | "DECONTAMINATION_SELECTION"
  | "DECONTAMINATION_SURFACE"
  | "CARBON_STORAGE"
  | "FLOOR_SURFACE"
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

  // Usages
  USES: "Usages",
  USES_SELECTION: "Liste des usages",
  USES_GREEN_SPACES_AREA: "Superficie des espaces verts",
  USES_FLOOR_AREA: "Surface de plancher des usages",

  // Sols et espaces
  SPACES_GREEN_SPACES_SOILS: "Liste des sols des espaces verts",

  SPACES: "Sols et espaces",
  SPACES_SELECTION: "Liste des sols et espaces des autres usages",
  SPACES_SURFACES: "Superficie des sols et espaces des autres usages",
  SOILS_SUMMARY: "Récapitulatif des sols",
  CARBON_STORAGE: "Stockage de carbone",
  SOILS_DECONTAMINATION: "Travaux",
  DECONTAMINATION_SELECTION: "Choix de dépolluer",
  DECONTAMINATION_SURFACE: "Surface à dépolluer",
  BUILDINGS: "Bâtiments",
  FLOOR_SURFACE: "Surface de plancher des usages",

  STAKEHOLDERS: "Acteurs",
  STAKEHOLDERS_PROJECT_DEVELOPER: "Aménageur",
  STAKEHOLDERS_REINSTATEMENT_OWNER: "Maître d'ouvrage",

  SITE_RESALE: "Cession foncière",
  SITE_CESSION: "Cession du site aménagé",
  BUILDINGS_CESSION: "Revente des bâtiments",

  EXPENSES: "Dépenses",
  EXPENSES_SITE_PURCHASE: "Acquisition foncière",
  EXPENSES_SITE_REINSTATEMENT: "Remise en état du site",
  EXPENSES_SITE_INSTALLATION: "Aménagement du site",
  EXPENSES_BUILDINGS_OPERATION: "Exploitation des bâtiments",

  REVENUE: "Recettes",
  REVENUE_BUILDINGS_OPERATION: "Exploitation des bâtiments",
  REVENUE_FINANCIAL_ASSISTANCE: "Aides financières",
  REVENUE_SITE_RESALE: "Cession foncière",
  REVENUE_BUILDINGS_RESALE: "Vente des bâtiments",

  SCHEDULE: "Calendrier",
  PROJECT_PROGRESS: "Avancement",

  NAMING: "Dénomination",

  SUMMARY: "Récapitulatif",
} as const;

export type StepStepperConfig = { groupId: StepGroupId; subGroupId?: StepSubGroupId };

type StepToGroupMapping = Record<UrbanProjectCreationStep, StepStepperConfig>;
export const STEP_TO_GROUP_MAPPING: StepToGroupMapping = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: creationModeSelectionStepperConfig,
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: { groupId: "CREATION_MODE" },
  URBAN_PROJECT_EXPRESS_SUMMARY: { groupId: "SUMMARY" },
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: { groupId: "SUMMARY" },
  // Uses flow
  URBAN_PROJECT_USES_INTRODUCTION: usesIntroductionStepperConfig,
  URBAN_PROJECT_USES_SELECTION: usesSelectionStepperConfig,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: publicGreenSpacesSurfaceAreaStepperConfig,
  // Espaces
  URBAN_PROJECT_SPACES_INTRODUCTION: spacesIntroductionStepperConfig,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: publicGreenSpacesIntroductionStepperConfig,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION:
    publicGreenSpacesSoilsDistributionStepperConfig,
  URBAN_PROJECT_SPACES_SELECTION: spacesSelectionStepperConfig,
  URBAN_PROJECT_SPACES_SURFACE_AREA: spacesSurfaceAreaStepperConfig,
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: soilsSummaryStepperConfig,
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: soilsCarbonSummaryStepperConfig,

  // Dépollution des sols
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: soilsDecontaminationIntroductionStepperConfig,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: soilsDecontaminationSelectionStepperConfig,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: soilsDecontaminationSurfaceAreaStepperConfig,

  // Bâtiments
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: buildingsIntroductionStepperConfig,
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: buildingsUsesFloorSurfaceAreaStepperConfig,

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
  URBAN_PROJECT_SCHEDULE_PROJECTION: scheduleProjectionStepperConfig,
  URBAN_PROJECT_PROJECT_PHASE: projectPhaseStepperConfig,

  // Final
  URBAN_PROJECT_NAMING: namingStepperConfig,
  URBAN_PROJECT_FINAL_SUMMARY: finalSummaryStepperConfig,
  URBAN_PROJECT_CREATION_RESULT: creationResultStepperConfig,
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
