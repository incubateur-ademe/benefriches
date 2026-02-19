import { createSelector } from "@reduxjs/toolkit";
import {
  isConstrainedSoilType,
  isNaturalSoil,
  ORDERED_SOIL_TYPES,
  typedObjectEntries,
} from "shared";
import type {
  SoilsDistribution,
  SoilType,
  UrbanProjectUse,
  UrbanProjectUseDistribution,
} from "shared";

import { RootState } from "@/shared/core/store-config/store";
import { buildStepGroupsFromSequence } from "@/shared/views/project-form/stepper/stepperConfig";

import { ProjectFormSelectors } from "../projectForm.selectors";
import { getProjectSummary } from "./helpers/projectSummary";
import { ReadStateHelper } from "./helpers/readState";
import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "./helpers/stakeholders";
import {
  answersByStepSchemas,
  AnswerStepId,
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
  selectors: ProjectFormSelectors,
) => {
  const selectSelf = (state: RootState) => state[entityName];

  const selectStepState = createSelector(selectSelf, (state) => state.urbanProject.steps);

  const selectProjectSoilsDistributionByType = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistributionBySoilType(state),
  );

  const selectProjectSoilsDistribution = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistribution(state),
  );

  const selectStepAnswers = <T extends AnswerStepId>(stepId: T) =>
    createSelector([selectStepState], (steps) => {
      if (!isAnswersStep(stepId)) {
        return undefined;
      }
      return (
        ReadStateHelper.getStepAnswers(steps, stepId) ??
        ReadStateHelper.getDefaultAnswers(steps, stepId)
      );
    });

  const selectSoilsCarbonStorageDifference = createSelector([selectStepState], (steps) => ({
    loadingState: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.loadingState ?? "idle",
    current: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.current,
    projected: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.projected,
  }));

  const selectProjectStepsSequence = createSelector(
    selectSelf,
    (state) => state.urbanProject.stepsSequence,
  );

  const selectProjectSummary = createSelector(
    [selectStepState, selectProjectStepsSequence, selectProjectSoilsDistribution],
    (steps, stepsSequence) => getProjectSummary(steps, stepsSequence),
  );

  const selectProjectStepsSequenceWithStatus = createSelector(
    [selectProjectStepsSequence, selectStepState],
    (stepsSequence, stepsState): { isCompleted: boolean; stepId: UrbanProjectCreationStep }[] =>
      stepsSequence.map((stepId) => {
        if (isAnswersStep(stepId)) {
          const isCompleted = stepsState[stepId]?.completed ?? false;
          const isAnswerValid = answersByStepSchemas[stepId].safeParse(
            stepsState[stepId]?.payload,
          ).success;
          return {
            stepId,
            isCompleted: isCompleted && isAnswerValid,
          };
        }
        return {
          stepId,
          isCompleted: stepsState[stepId]?.completed ?? false,
        };
      }),
  );

  const selectStepsGroupedBySections = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (selectProjectStepsSequenceWithStatus) =>
      buildStepGroupsFromSequence(selectProjectStepsSequenceWithStatus),
  );

  const selectIsFormStatusValid = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (stepsSequenceWithStatus) => {
      return stepsSequenceWithStatus.every(({ stepId, isCompleted }) =>
        isAnswersStep(stepId) ? isCompleted : true,
      );
    },
  );

  const selectNextEmptyStep = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (stepsSequenceWithStatus) =>
      stepsSequenceWithStatus.find(
        ({ isCompleted, stepId }) =>
          (isAnswersStep(stepId) || isSummaryStep(stepId)) && !isCompleted,
      )?.stepId,
  );

  const selectProjectDeveloper = createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
        ?.projectDeveloper,
  );

  const selectReinstatementContractOwner = createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner,
  );

  const selectUrbanProjectAvailableStakeholders = createSelector(
    [
      selectors.selectProjectAvailableStakeholders,
      selectProjectDeveloper,
      selectReinstatementContractOwner,
    ],
    (projectAvailableStakeholders, projectDeveloper, reinstatementContractOwner) =>
      getUrbanProjectAvailableStakeholders({
        projectAvailableStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      }),
  );

  const selectUrbanProjectAvailableLocalAuthoritiesStakeholders = createSelector(
    [
      selectors.selectAvailableLocalAuthoritiesStakeholders,
      selectProjectDeveloper,
      selectReinstatementContractOwner,
    ],
    (availableLocalAuthoritiesStakeholders, projectDeveloper, reinstatementContractOwner) => {
      return getUrbanProjectAvailableLocalAuthoritiesStakeholders({
        availableLocalAuthoritiesStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      });
    },
  );

  const selectPendingStepCompletion = createSelector(
    [selectSelf],
    (state) => state.urbanProject.pendingStepCompletion,
  );

  const selectSaveState = createSelector([selectSelf], (state) => state.urbanProject.saveState);

  type SiteResaleRevenueViewData = {
    isPriceEstimated: boolean;
    initialSellingPrice: number | undefined;
    initialPropertyTransferDuties: number | undefined;
  };

  const selectSiteResaleRevenueViewData = createSelector(
    [selectStepState],
    (steps): SiteResaleRevenueViewData => {
      const revenueAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");

      return {
        isPriceEstimated: ReadStateHelper.isSiteResalePriceEstimated(steps),
        initialSellingPrice: revenueAnswers?.siteResaleExpectedSellingPrice,
        initialPropertyTransferDuties: revenueAnswers?.siteResaleExpectedPropertyTransferDuties,
      };
    },
  );

  type PublicGreenSpacesSurfaceAreaViewData = {
    publicGreenSpacesSurfaceArea: number | undefined;
    siteSurfaceArea: number;
  };

  const selectPublicGreenSpacesSurfaceAreaViewData = createSelector(
    [selectStepState, selectors.selectSiteSurfaceArea],
    (steps, siteSurfaceArea): PublicGreenSpacesSurfaceAreaViewData => {
      const answers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");

      return {
        publicGreenSpacesSurfaceArea: answers?.publicGreenSpacesSurfaceArea,
        siteSurfaceArea,
      };
    },
  );

  type UsesFloorSurfaceAreaViewData = {
    usesFloorSurfaceAreaDistribution: UrbanProjectUseDistribution | undefined;
    selectedUses: UrbanProjectUse[];
    buildingsFootprintSurfaceArea: number | undefined;
  };

  const selectUsesFloorSurfaceAreaViewData = createSelector(
    [selectStepState],
    (steps): UsesFloorSurfaceAreaViewData => {
      const floorAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      const selectionAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_USES_SELECTION",
      );

      const spacesAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA");

      return {
        usesFloorSurfaceAreaDistribution: floorAnswers?.usesFloorSurfaceAreaDistribution,
        selectedUses: selectionAnswers?.usesSelection ?? [],
        buildingsFootprintSurfaceArea: spacesAnswers?.spacesSurfaceAreaDistribution?.BUILDINGS,
      };
    },
  );

  type SpacesSelectionViewData = {
    selectedSpaces: SoilType[];
    selectableSoils: SoilType[];
    nonGreenSpacesUses: UrbanProjectUse[];
    hasPublicGreenSpaces: boolean;
  };

  /**
   * Computes the list of soils that can be selected for the project.
   * Non-constrained soils (BUILDINGS, IMPERMEABLE_SOILS, MINERAL_SOIL, ARTIFICIAL_*)
   * are always selectable. Constrained soils (forests, prairies, agricultural, wetlands)
   * are only selectable if they already exist on the site.
   */
  const computeSelectableSoils = (siteSoilsDistribution: SoilsDistribution): SoilType[] => {
    const siteSoils = Object.keys(siteSoilsDistribution) as SoilType[];

    return ORDERED_SOIL_TYPES.filter((soilType) => {
      // Non-constrained soils are always selectable
      if (!isConstrainedSoilType(soilType)) {
        return true;
      }
      // Constrained soils are only selectable if they exist on the site
      return siteSoils.includes(soilType);
    });
  };

  const selectSpacesSelectionViewData = createSelector(
    [selectStepState, selectors.selectSiteSoilsDistribution],
    (steps, siteSoilsDistribution): SpacesSelectionViewData => {
      const spacesAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SELECTION") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SELECTION");

      const selectedUses =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

      return {
        selectedSpaces: spacesAnswers?.spacesSelection ?? [],
        selectableSoils: computeSelectableSoils(siteSoilsDistribution),
        nonGreenSpacesUses: selectedUses.filter(
          (use): use is UrbanProjectUse => use !== "PUBLIC_GREEN_SPACES",
        ),
        hasPublicGreenSpaces: selectedUses.includes("PUBLIC_GREEN_SPACES"),
      };
    },
  );

  type SpaceConstraint = {
    soilType: SoilType;
    maxSurfaceArea: number;
  };

  type SpacesSurfaceAreaViewData = {
    selectedSpaces: SoilType[];
    spacesSurfaceAreaDistribution: Partial<Record<SoilType, number>> | undefined;
    totalSurfaceArea: number;
    spacesWithConstraints: SpaceConstraint[];
    nonGreenSpacesUses: UrbanProjectUse[];
    hasPublicGreenSpaces: boolean;
  };

  const selectSpacesSurfaceAreaViewData = createSelector(
    [selectStepState, selectors.selectSiteSurfaceArea, selectors.selectSiteSoilsDistribution],
    (steps, siteSurfaceArea, siteSoilsDistribution): SpacesSurfaceAreaViewData => {
      const surfaceAreaAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA");

      const spacesSelectionAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_SPACES_SELECTION",
      );

      const selectedSpaces = spacesSelectionAnswers?.spacesSelection ?? [];

      const selectedUses =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

      const publicGreenSpacesSurfaceArea =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA")
          ?.publicGreenSpacesSurfaceArea ?? 0;

      // Compute constraints for constrained soils that exist on site
      const spacesWithConstraints: SpaceConstraint[] = selectedSpaces
        .filter((soilType) => isConstrainedSoilType(soilType))
        .map((soilType) => ({
          soilType,
          maxSurfaceArea: siteSoilsDistribution[soilType] ?? 0,
        }))
        .filter((constraint) => constraint.maxSurfaceArea > 0);

      return {
        selectedSpaces,
        spacesSurfaceAreaDistribution: surfaceAreaAnswers?.spacesSurfaceAreaDistribution,
        totalSurfaceArea: siteSurfaceArea - publicGreenSpacesSurfaceArea,
        spacesWithConstraints,
        nonGreenSpacesUses: selectedUses.filter(
          (use): use is UrbanProjectUse => use !== "PUBLIC_GREEN_SPACES",
        ),
        hasPublicGreenSpaces: selectedUses.includes("PUBLIC_GREEN_SPACES"),
      };
    },
  );

  type PublicGreenSpacesSoilsDistributionViewData = {
    availableSoilTypes: SoilType[];
    publicGreenSpacesSoilsDistribution: Partial<Record<SoilType, number>> | undefined;
    totalSurfaceArea: number;
    existingNaturalSoilsConstraints: SpaceConstraint[];
  };

  const selectPublicGreenSpacesSoilsDistributionViewData = createSelector(
    [selectStepState, selectors.selectSiteSoilsDistribution],
    (steps, siteSoilsDistribution): PublicGreenSpacesSoilsDistributionViewData => {
      const distributionAnswers =
        ReadStateHelper.getStepAnswers(
          steps,
          "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        ) ??
        ReadStateHelper.getDefaultAnswers(
          steps,
          "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        );

      const totalSurfaceArea =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA")
          ?.publicGreenSpacesSurfaceArea ?? 0;

      const siteSoils = Object.keys(siteSoilsDistribution) as SoilType[];

      // All soil types except BUILDINGS, with constrained soils filtered to only those on site
      const availableSoilTypes = ORDERED_SOIL_TYPES.filter((soilType) => {
        if (soilType === "BUILDINGS") return false;
        if (!isConstrainedSoilType(soilType)) return true;
        return siteSoils.includes(soilType);
      });

      const existingNaturalSoilsConstraints: SpaceConstraint[] = availableSoilTypes
        .filter(isNaturalSoil)
        .map((soilType) => ({
          soilType,
          maxSurfaceArea: siteSoilsDistribution[soilType] ?? 0,
        }));

      return {
        availableSoilTypes,
        publicGreenSpacesSoilsDistribution: distributionAnswers?.publicGreenSpacesSoilsDistribution,
        totalSurfaceArea,
        existingNaturalSoilsConstraints,
      };
    },
  );

  type PublicGreenSpacesIntroductionViewData = {
    existingNaturalSoils: { soilType: SoilType; surfaceArea: number }[];
  };

  const selectPublicGreenSpacesIntroductionViewData = createSelector(
    [selectors.selectSiteSoilsDistribution],
    (siteSoilsDistribution): PublicGreenSpacesIntroductionViewData => {
      const existingNaturalSoils = typedObjectEntries(siteSoilsDistribution)
        .filter(([soilType]) => isNaturalSoil(soilType))
        .map(([soilType, surfaceArea]) => ({ soilType, surfaceArea: surfaceArea ?? 0 }));

      return { existingNaturalSoils };
    },
  );

  return {
    selectStepState,
    selectProjectSoilsDistributionByType,
    selectProjectSoilsDistribution,
    selectStepAnswers,
    selectSoilsCarbonStorageDifference,
    selectIsFormStatusValid,
    selectProjectSummary,
    selectStepsGroupedBySections,
    selectNextEmptyStep,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
    selectPendingStepCompletion,
    selectSaveState,
    selectSiteResaleRevenueViewData,
    selectPublicGreenSpacesSurfaceAreaViewData,
    selectUsesFloorSurfaceAreaViewData,
    selectSpacesSelectionViewData,
    selectSpacesSurfaceAreaViewData,
    selectPublicGreenSpacesSoilsDistributionViewData,
    selectPublicGreenSpacesIntroductionViewData,
    ...selectors,
  };
};
