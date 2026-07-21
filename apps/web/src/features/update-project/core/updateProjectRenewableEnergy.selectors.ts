import { createSelector } from "@reduxjs/toolkit";
import {
  AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
  FinancialAssistanceRevenue,
  getDefaultScheduleForProject,
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower,
  getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea,
  getRevenueAmountByPurpose,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower,
  computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower,
  isBiodiversityAndClimateSensibleSoil,
  PhotovoltaicInstallationExpense,
  ProjectSchedule,
  ProjectScheduleBuilder,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
  TExpense,
  typedObjectKeys,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "shared";

import { RootState } from "@/app/store/store";
import { createWizardFormSelectors } from "@/features/create-project/core/project-form/projectForm.selectors";
import { generateRenewableEnergyProjectName } from "@/features/create-project/core/project-form/projectName";
import {
  AvailableProjectStakeholder,
  hasStakeholder,
} from "@/features/create-project/core/project-form/stakeholders";
import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { ReadStateHelper } from "@/features/create-project/core/renewable-energy/helpers/readState";
import {
  answersByStepSchemas,
  isAnswersStep,
} from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import {
  computeRenewableEnergyStepperGroups,
  RenewableEnergyStepperGroup,
} from "@/features/create-project/core/renewable-energy/selectors/stepperNavigation";
import { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import { computePercentage } from "@/shared/core/percentage/percentage";

const selectSelf = (state: RootState) => state.projectUpdate;

// Reuse the L2 project-form base (ADR-0015): site/stakeholder-availability selectors are
// already generic over the "projectCreation"/"projectUpdate" slice, so PV's editing selectors
// don't need to redefine them — only the PV step-answer selectors below are feature-owned.
const wizardFormSelectors = createWizardFormSelectors("projectUpdate");
export const {
  selectSiteData,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
  selectProjectAvailableStakeholders,
  selectAvailableLocalAuthoritiesStakeholders,
} = wizardFormSelectors;

export const selectSteps = createSelector(
  selectSelf,
  (state): RenewableEnergyStepsState => state.renewableEnergyProject.steps,
);

export const selectSaveState = createSelector(
  selectSelf,
  (state) => state.renewableEnergyProject.saveState,
);

const selectStepsSequence = createSelector(
  selectSelf,
  (state) => state.renewableEnergyProject.stepsSequence,
);

// Only steps actually reachable by the current answers (the walked sequence) must be
// complete — unlike the full ANSWER_STEPS union, which also lists steps a given branch
// (e.g. non-suitable-soils) never visits.
export const selectIsFormStatusValid = createSelector(
  [selectSteps, selectStepsSequence],
  (steps, stepsSequence): boolean => {
    return stepsSequence.every((stepId) => {
      if (!isAnswersStep(stepId)) return true;
      const step = steps[stepId];
      return (
        Boolean(step?.completed) && answersByStepSchemas[stepId].safeParse(step?.payload).success
      );
    });
  },
);

export const selectExpectedPhotovoltaicPerformance = createSelector(
  selectSelf,
  (state) => state.renewableEnergyProject.expectedPhotovoltaicPerformance,
);

export const selectSoilsCarbonStorage = createSelector(
  selectSelf,
  (state) => state.renewableEnergyProject.soilsCarbonStorage,
);

export const selectProjectSoilsDistribution = createSelector(
  selectSteps,
  (steps): SoilsDistribution => {
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    if (customAllocation?.soilsDistribution) return customAllocation.soilsDistribution;

    const projectSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    );
    if (projectSelection?.soilsDistribution) return projectSelection.soilsDistribution;

    return {};
  },
);

export const selectPhotovoltaicPowerStationScheduleInitialValues = createSelector(
  [selectSteps],
  (steps): ProjectSchedule => {
    const schedule = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
    if (schedule?.photovoltaicInstallationSchedule && schedule.firstYearOfOperation) {
      return new ProjectScheduleBuilder()
        .withInstallation(schedule.photovoltaicInstallationSchedule)
        .withFirstYearOfOperations(schedule.firstYearOfOperation)
        .withReinstatement(schedule.reinstatementSchedule)
        .build();
    }

    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    return getDefaultScheduleForProject({ now: () => new Date() })({
      hasReinstatement: involvesReinstatement === true,
    });
  },
);

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(selectSteps, (steps): number => {
  return (
    ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      ?.photovoltaicInstallationSurfaceSquareMeters ?? 0
  );
});

export const selectSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  selectSiteData,
  (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state?.soilsDistribution ?? {});
  },
);

export const selectMissingSuitableSurfaceArea = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSiteSoilsDistribution],
  (neededSurfaceArea, siteSoilsDistribution): number => {
    return neededSurfaceArea - getSuitableSurfaceAreaForPhotovoltaicPanels(siteSoilsDistribution);
  },
);

export const selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): number => {
    return getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed(
      siteSoilsDistribution,
      projectSoilsDistribution,
    );
  },
);

export const selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate =
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): boolean => {
      return willTransformationNoticeablyImpactBiodiversityAndClimate(
        siteSoilsDistribution,
        projectSoilsDistribution,
      );
    },
  );

export const selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea = createSelector(
  selectProjectSoilsDistribution,
  (futureSoilsDistribution: SoilsDistribution): number => {
    return sumSoilsSurfaceAreasWhere(futureSoilsDistribution, isBiodiversityAndClimateSensibleSoil);
  },
);

export const selectRenewableEnergyProjectAvailableStakeholders = createSelector(
  [selectProjectAvailableStakeholders, selectSteps],
  (projectAvailableStakeholders, steps) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders;

    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;
    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const futureOperator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator;
    if (futureOperator && !hasStakeholder(futureOperator, stakeholders)) {
      stakeholders.push({
        name: futureOperator.name,
        role: "project_stakeholder",
        structureType: futureOperator.structureType,
      });
    }

    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;
    if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
      stakeholders.push({
        name: reinstatementContractOwner.name,
        role: "project_stakeholder",
        structureType: reinstatementContractOwner.structureType,
      });
    }

    const futureSiteOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    )?.futureSiteOwner;
    if (futureSiteOwner && !hasStakeholder(futureSiteOwner, stakeholders)) {
      stakeholders.push({
        name: futureSiteOwner.name,
        role: "project_stakeholder",
        structureType: futureSiteOwner.structureType,
      });
    }

    return stakeholders;
  },
);

export const selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders = createSelector(
  [selectAvailableLocalAuthoritiesStakeholders, selectSteps],
  (availableLocalAuthoritiesStakeholders, steps) => {
    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;
    const futureOperator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator;
    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;
    const futureSiteOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    )?.futureSiteOwner;

    const projectLocalAuthorities = [
      projectDeveloper,
      futureOperator,
      reinstatementContractOwner,
      futureSiteOwner,
    ].filter(
      (element) =>
        element && ["municipality", "epci", "department", "region"].includes(element.structureType),
    ) as ProjectStakeholder[];

    const currentLocalAuthorities = projectLocalAuthorities.map((element) => ({
      type: element.structureType,
      name: element.name,
    }));

    return availableLocalAuthoritiesStakeholders.filter(
      (addressLocalAuthority) =>
        !currentLocalAuthorities.some(
          (currentLocalAuthority) =>
            currentLocalAuthority.type === addressLocalAuthority.type &&
            currentLocalAuthority.name === addressLocalAuthority.name,
        ),
    );
  },
);

type PhotovoltaicPowerPlantUpdateStepperDataView = {
  stepGroups: RenewableEnergyStepperGroup[];
};
export const selectPhotovoltaicPowerPlantUpdateStepperDataView = createSelector(
  [selectSelf, selectSteps, selectStepsSequence],
  (state, steps, stepsSequence): PhotovoltaicPowerPlantUpdateStepperDataView => ({
    stepGroups: computeRenewableEnergyStepperGroups({
      currentStep: state.renewableEnergyProject.currentStep,
      steps,
      stepsSequence,
    }),
  }),
);

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(selectSteps, (steps) => {
  return ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER")
    ?.photovoltaicKeyParameter;
});

type PhotovoltaicPowerViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number;
      photovoltaicInstallationSurfaceArea: number;
      recommendedPowerKWc: number;
      siteSurfaceArea: number;
    }
  | {
      keyParameter: "POWER";
      initialValue: number | undefined;
      recommendedPowerKWc: number;
      photovoltaicInstallationSurfaceArea: undefined;
      siteSurfaceArea: number;
    };
export const selectPhotovoltaicPowerViewData = createSelector(
  [selectSteps, selectSiteSurfaceArea],
  (steps, siteSurfaceArea): PhotovoltaicPowerViewData => {
    const keyParameter = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;
    const powerKWc = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
    )?.photovoltaicInstallationElectricalPowerKWc;
    const surfaceArea = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    )?.photovoltaicInstallationSurfaceSquareMeters;

    if (keyParameter === "SURFACE") {
      const installationSurfaceArea = surfaceArea ?? 0;
      const recommendedPowerKWc =
        getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(installationSurfaceArea);
      const initialValue = powerKWc ?? recommendedPowerKWc;
      return {
        initialValue,
        keyParameter: "SURFACE",
        photovoltaicInstallationSurfaceArea: installationSurfaceArea,
        recommendedPowerKWc,
        siteSurfaceArea,
      };
    }
    const recommendedPowerKWc =
      getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(siteSurfaceArea);
    return {
      initialValue: powerKWc ?? recommendedPowerKWc,
      keyParameter: "POWER",
      recommendedPowerKWc,
      photovoltaicInstallationSurfaceArea: undefined,
      siteSurfaceArea,
    };
  },
);

type PhotovoltaicSurfaceAreaViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number | undefined;
      siteSurfaceArea: number;
      recommendedSurfaceArea: undefined;
      electricalPowerKWc: undefined;
    }
  | {
      keyParameter: "POWER";
      initialValue: number;
      siteSurfaceArea: number;
      recommendedSurfaceArea: number;
      electricalPowerKWc: number;
    };
export const selectPhotovoltaicSurfaceViewData = createSelector(
  [selectSteps, selectSiteSurfaceArea],
  (steps, siteSurfaceArea): PhotovoltaicSurfaceAreaViewData => {
    const keyParameter = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;
    const surfaceArea = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    )?.photovoltaicInstallationSurfaceSquareMeters;
    const electricalPowerKWc = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
    )?.photovoltaicInstallationElectricalPowerKWc;

    if (keyParameter === "SURFACE") {
      return {
        keyParameter: "SURFACE",
        initialValue: surfaceArea,
        siteSurfaceArea,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      };
    }

    const power = electricalPowerKWc ?? 0;
    const recommendedSurfaceArea = Math.min(
      getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower(power),
      siteSurfaceArea,
    );
    const initialValue = surfaceArea ?? recommendedSurfaceArea;
    return {
      keyParameter: "POWER",
      initialValue,
      recommendedSurfaceArea,
      siteSurfaceArea,
      electricalPowerKWc: power,
    };
  },
);

type ExpectedAnnualProductionViewData = {
  loadingState: string;
  expectedPerformanceMwhPerYear: number | undefined;
};
export const selectExpectedAnnualProductionViewData = createSelector(
  selectExpectedPhotovoltaicPerformance,
  (performance): ExpectedAnnualProductionViewData => ({
    loadingState: performance.loadingState,
    expectedPerformanceMwhPerYear: performance.expectedPerformanceMwhPerYear,
  }),
);

type ContractDurationViewData = {
  initialValues: { photovoltaicContractDuration: number };
};
export const selectContractDurationViewData = createSelector(
  selectSteps,
  (steps): ContractDurationViewData => {
    const savedValue = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    )?.photovoltaicContractDuration;

    return {
      initialValues: {
        photovoltaicContractDuration: savedValue ?? AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
      },
    };
  },
);

export const selectNameAndDescriptionInitialValues = createSelector([selectSteps], (steps) => {
  const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
  if (naming?.name) {
    return { name: naming.name, description: naming.description };
  }
  return { name: generateRenewableEnergyProjectName("PHOTOVOLTAIC_POWER_PLANT") };
});

type InvolvesReinstatementViewData = {
  initialValues: { involvesReinstatement: "yes" | "no" } | undefined;
};
export const selectInvolvesReinstatementViewData = createSelector(
  selectSteps,
  (steps): InvolvesReinstatementViewData => {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;
    return {
      initialValues:
        involvesReinstatement === undefined
          ? undefined
          : { involvesReinstatement: involvesReinstatement ? "yes" : "no" },
    };
  },
);

type SoilsDecontaminationSelectionViewData = {
  initialValues: { decontaminationSelection: "partial" | "none" | "unknown" | null };
};
export const selectSoilsDecontaminationSelectionViewData = createSelector(
  selectSteps,
  (steps): SoilsDecontaminationSelectionViewData => {
    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    return {
      initialValues: { decontaminationSelection: decontaminationPlan ?? null },
    };
  },
);

const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectSteps, selectSiteData],
  (steps, siteData) => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const surfaceAreaStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const surfaceToDecontaminate =
      surfaceAreaStep?.decontaminatedSurfaceArea ??
      decontaminationSelection?.decontaminatedSurfaceArea;
    const contaminatedSurfaceArea = siteData?.contaminatedSoilSurface;
    if (!contaminatedSurfaceArea || !surfaceToDecontaminate) return 0;

    return computePercentage(surfaceToDecontaminate, contaminatedSurfaceArea);
  },
);

type PVDecontaminationSurfaceAreaViewData = {
  contaminatedSurfaceArea: number;
  surfaceAreaToDecontaminateInPercentage: number;
};
export const selectPVDecontaminationSurfaceAreaViewData = createSelector(
  [selectSiteContaminatedSurfaceArea, selectContaminatedSurfaceAreaPercentageToDecontaminate],
  (
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  ): PVDecontaminationSurfaceAreaViewData => ({
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  }),
);

type PVClimateAndBiodiversityImpactNoticeViewData = {
  hasTransformationNegativeImpact: boolean;
  biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed: number;
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: number;
};
export const selectPVClimateAndBiodiversityImpactNoticeViewData = createSelector(
  [
    selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
    selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
    selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  ],
  (
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  ): PVClimateAndBiodiversityImpactNoticeViewData => ({
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  }),
);

type FutureSoilsSelectionViewData = {
  initialValues: SoilType[];
  selectableSoils: SoilType[];
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSelectionViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution],
  (steps, siteSoilsDistribution): FutureSoilsSelectionViewData => {
    const nonSuitableSoilsSurfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const customSoilsSelectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const baseSoilsDistribution =
      nonSuitableSoilsSurfaceStep?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution;
    const selectableSoils = getSuitableSoilsForTransformation(
      typedObjectKeys(baseSoilsDistribution),
    );
    const initialValues =
      customSoilsSelectionStep?.futureSoilsSelection ?? REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS;
    return {
      initialValues,
      selectableSoils,
      baseSoilsDistribution,
    };
  },
);

type FutureSoilsSurfaceAreasViewData = {
  initialValues?: SoilsDistribution;
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSurfaceAreasViewData = createSelector(
  [selectSteps, selectSiteSurfaceArea, selectSiteSoilsDistribution],
  (steps, siteSurfaceArea, siteSoilsDistribution): FutureSoilsSurfaceAreasViewData => {
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    const customSoilsSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const nonSuitableSoilsSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    );

    const initialValues = customAllocation?.soilsDistribution;
    const selectedSoils = customSoilsSelection?.futureSoilsSelection ?? [];
    const photovoltaicPanelsSurfaceArea =
      surfaceStep?.photovoltaicInstallationSurfaceSquareMeters ?? 0;

    return {
      initialValues,
      selectedSoils,
      photovoltaicPanelsSurfaceArea,
      siteSurfaceArea,
      baseSoilsDistribution:
        nonSuitableSoilsSurface?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution,
    };
  },
);

type PVNonSuitableSoilsNoticeViewData = {
  photovoltaicPanelsSurfaceArea: number;
  suitableSurfaceArea: number;
};
export const selectPVNonSuitableSoilsNoticeViewData = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
  (photovoltaicPanelsSurfaceArea, suitableSurfaceArea): PVNonSuitableSoilsNoticeViewData => ({
    photovoltaicPanelsSurfaceArea,
    suitableSurfaceArea,
  }),
);

type NonSuitableSoilsSelectionViewData = {
  initialValues: { soils: SoilType[] };
  nonSuitableSoils: SoilsDistribution;
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSelectionViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (steps, siteSoilsDistribution, missingSuitableSurfaceArea): NonSuitableSoilsSelectionViewData => {
    const nonSuitableSoils = getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const selection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    return {
      initialValues: { soils: selection?.nonSuitableSoilsToTransform ?? [] },
      nonSuitableSoils,
      missingSuitableSurfaceArea,
    };
  },
);

type NonSuitableSoilsSurfaceAreaToTransformViewData = {
  initialValues: SoilsDistribution;
  soilsToTransform: { soilType: SoilType; currentSurfaceArea: number }[];
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSoilsSurfaceAreaToTransformViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (
    steps,
    siteSoilsDistribution,
    missingSuitableSurfaceArea,
  ): NonSuitableSoilsSurfaceAreaToTransformViewData => {
    const nonSuitableSoilsSurfaceAreas =
      getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const selectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    const initialValues =
      surfaceStep?.nonSuitableSoilsSurfaceAreaToTransform ??
      typedObjectKeys(nonSuitableSoilsSurfaceAreas).reduce<SoilsDistribution>((acc, soilType) => {
        acc[soilType] = 0;
        return acc;
      }, {});

    const soilsToTransform = (selectionStep?.nonSuitableSoilsToTransform ?? []).map((soilType) => {
      return { soilType, currentSurfaceArea: nonSuitableSoilsSurfaceAreas[soilType] ?? 0 };
    });
    return {
      initialValues,
      missingSuitableSurfaceArea,
      soilsToTransform,
    };
  },
);

export const selectSoilsTransformationProjectSelectionViewData = createSelector(
  selectSteps,
  (steps) => {
    const soilsTransformationProject = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    )?.soilsTransformationProject;

    return {
      initialValues: soilsTransformationProject ? { soilsTransformationProject } : undefined,
    };
  },
);

type PVSoilsSummaryViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};
export const selectPVSoilsSummaryViewData = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): PVSoilsSummaryViewData => ({
    siteSoilsDistribution,
    projectSoilsDistribution,
  }),
);

export const selectSoilsCarbonStorageViewData = selectSoilsCarbonStorage;

type PVOperatorViewData = {
  currentUser: ReturnType<typeof selectCurrentUserStructure>;
  initialValue: ProjectStakeholder | undefined;
};
export const selectPVOperatorViewData = createSelector(
  [selectCurrentUserStructure, selectSteps],
  (currentUser, steps): PVOperatorViewData => ({
    currentUser,
    initialValue: ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator,
  }),
);

type PVStakeholderFormViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: ReturnType<
    typeof selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders
  >;
};
export const selectPVDeveloperViewData = createSelector(
  [
    selectRenewableEnergyProjectAvailableStakeholders,
    selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  ],
  (
    availableStakeholdersList,
    availableLocalAuthoritiesStakeholders,
  ): PVStakeholderFormViewData => ({
    availableStakeholdersList,
    availableLocalAuthoritiesStakeholders,
  }),
);
export const selectPVFutureSiteOwnerViewData = selectPVDeveloperViewData;
export const selectPVReinstatementContractOwnerViewData = selectPVDeveloperViewData;

type SitePurchasedViewData = {
  isCurrentUserSiteOwner: boolean;
  initialValues:
    | {
        willSiteBePurchased: boolean;
      }
    | undefined;
  siteOwnerName: string | undefined;
};
export const selectSitePurchasedViewData = createSelector(
  [selectSteps, selectSiteData, selectCurrentUserStructure],
  (steps, siteData, currentUserStructure): SitePurchasedViewData => {
    const isCurrentUserSiteOwner =
      siteData && currentUserStructure
        ? siteData.owner.name === currentUserStructure.name &&
          siteData.owner.structureType === currentUserStructure.type
        : false;

    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
    );

    return {
      isCurrentUserSiteOwner,
      initialValues:
        sitePurchase?.willSiteBePurchased !== undefined
          ? { willSiteBePurchased: sitePurchase.willSiteBePurchased }
          : undefined,
      siteOwnerName: siteData ? siteData.owner.name : undefined,
    };
  },
);

const getExpenseAmountByPurpose = <TExpenses extends TExpense<string>[]>(
  expenses: TExpenses,
  purpose: TExpenses[number]["purpose"],
): number | undefined => {
  return expenses.find((expense) => expense.purpose === purpose)?.amount;
};

type PhotovoltaicPowerStationInstallationExpensesInitialValues = {
  works: number;
  technicalStudy: number;
  other: number;
};
export const selectPhotovoltaicPowerStationInstallationExpensesInitialValues = createSelector(
  selectSteps,
  (steps): PhotovoltaicPowerStationInstallationExpensesInitialValues => {
    const installationStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
    const enteredExpenses = installationStep?.photovoltaicPanelsInstallationExpenses;
    if (enteredExpenses?.length) {
      return {
        technicalStudy: getExpenseAmountByPurpose(enteredExpenses, "technical_studies") ?? 0,
        works: getExpenseAmountByPurpose(enteredExpenses, "installation_works") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const electricalPowerKWc =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
        ?.photovoltaicInstallationElectricalPowerKWc ?? 0;
    return computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower(
      electricalPowerKWc,
    );
  },
);

type PVReinstatementExpensesViewData = {
  decontaminatedSurfaceArea: number;
  reinstatementExpenses: ReinstatementExpense[] | undefined;
};
export const selectPVReinstatementExpensesViewData = createSelector(
  [selectSteps],
  (steps): PVReinstatementExpensesViewData => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const decontaminationSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const reinstatementExpenses =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")
        ?.reinstatementExpenses ??
      ReadStateHelper.getDefaultAnswers(steps, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")
        ?.reinstatementExpenses;
    return {
      decontaminatedSurfaceArea:
        decontaminationSurface?.decontaminatedSurfaceArea ??
        decontaminationSelection?.decontaminatedSurfaceArea ??
        0,
      reinstatementExpenses,
    };
  },
);

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties: number;
};
export const selectSitePurchaseAmounts = createSelector(
  [selectSteps],
  (steps): SitePurchaseAmounts | undefined => {
    const amounts = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    if (!amounts?.sellingPrice) return undefined;
    return {
      sellingPrice: amounts.sellingPrice ?? 0,
      propertyTransferDuties: amounts.propertyTransferDuties ?? 0,
    };
  },
);

type PhotovoltaicPowerStationYearlyExpensesInitialValues = {
  rent: number;
  maintenance: number;
  taxes: number;
  other: number;
};
export const selectPhotovoltaicPowerStationYearlyExpensesInitialValues = createSelector(
  [selectSteps],
  (steps): PhotovoltaicPowerStationYearlyExpensesInitialValues => {
    const yearlyStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
    );
    const enteredExpenses = yearlyStep?.yearlyProjectedExpenses;
    if (enteredExpenses?.length) {
      return {
        rent: getExpenseAmountByPurpose(enteredExpenses, "rent") ?? 0,
        maintenance: getExpenseAmountByPurpose(enteredExpenses, "maintenance") ?? 0,
        taxes: getExpenseAmountByPurpose(enteredExpenses, "taxes") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const electricalPowerKWc =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
        ?.photovoltaicInstallationElectricalPowerKWc ?? 0;
    return computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower(electricalPowerKWc);
  },
);

export const selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues = createSelector(
  [selectSteps],
  (steps) => {
    const financialStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
    );
    const financialAssistanceRevenues: FinancialAssistanceRevenue[] | undefined =
      financialStep?.financialAssistanceRevenues;
    if (financialAssistanceRevenues?.length) {
      return {
        localOrRegionalAuthority:
          getRevenueAmountByPurpose(
            financialAssistanceRevenues,
            "local_or_regional_authority_participation",
          ) ?? 0,
        publicSubsidies:
          getRevenueAmountByPurpose(financialAssistanceRevenues, "public_subsidies") ?? 0,
        other: getRevenueAmountByPurpose(financialAssistanceRevenues, "other") ?? 0,
      };
    }

    return {
      localOrRegionalAuthority: 0,
      publicSubsidies: 0,
      other: 0,
    };
  },
);

const selectPhotovoltaicPowerStationYearlyRevenueInitialValues = createSelector(
  selectSteps,
  (steps) => {
    const revenueStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
    );
    const productionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    const yearlyProjectedRevenues: RecurringRevenue[] | undefined =
      revenueStep?.yearlyProjectedRevenues;
    const photovoltaicExpectedAnnualProduction =
      productionStep?.photovoltaicExpectedAnnualProduction;

    if (yearlyProjectedRevenues?.length) {
      return {
        operations: getRevenueAmountByPurpose(yearlyProjectedRevenues, "operations") ?? 0,
        other: getRevenueAmountByPurpose(yearlyProjectedRevenues, "other") ?? 0,
      };
    }

    return {
      operations: computeDefaultPhotovoltaicYearlyRecurringRevenueAmount(
        photovoltaicExpectedAnnualProduction ?? 0,
      ),
      other: 0,
    };
  },
);

type PVYearlyProjectedRevenueViewData = {
  initialValues: ReturnType<typeof selectPhotovoltaicPowerStationYearlyRevenueInitialValues>;
};
export const selectPVYearlyProjectedRevenueViewData = createSelector(
  [selectPhotovoltaicPowerStationYearlyRevenueInitialValues],
  (initialValues): PVYearlyProjectedRevenueViewData => ({
    initialValues,
  }),
);

type PVScheduleProjectionViewData = {
  initialValues: ReturnType<typeof selectPhotovoltaicPowerStationScheduleInitialValues>;
  hasReinstatement: boolean;
};
export const selectPVScheduleProjectionViewData = createSelector(
  [selectPhotovoltaicPowerStationScheduleInitialValues, selectSteps],
  (initialValues, steps): PVScheduleProjectionViewData => ({
    initialValues,
    hasReinstatement:
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
        ?.involvesReinstatement === true,
  }),
);

type FinalSummaryViewData = {
  projectData: {
    name: string;
    description?: string;
    decontaminatedSurfaceArea?: number;
    developmentPlanCategory: "RENEWABLE_ENERGY";
    renewableEnergy: "PHOTOVOLTAIC_POWER_PLANT";
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: ReturnType<typeof selectSoilsCarbonStorage>["projected"];
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
    sitePurchaseTotalCost?: number;
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementExpenses?: ReinstatementExpense[];
    photovoltaicPanelsInstallationExpenses?: PhotovoltaicInstallationExpense[];
    yearlyProjectedExpenses: RecurringExpense[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: { startDate: string; endDate: string };
    photovoltaicInstallationSchedule?: { startDate: string; endDate: string };
    firstYearOfOperation?: number;
  };
  siteData: {
    surfaceArea: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: ReturnType<typeof selectSoilsCarbonStorage>["current"];
    name: string;
  };
};
export const selectPhotovoltaicFinalSummaryViewData = createSelector(
  [selectSteps, selectSiteData, selectSoilsCarbonStorage, selectProjectSoilsDistribution],
  (steps, siteData, soilsCarbonStorage, soilsDistribution): FinalSummaryViewData => {
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    const power = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    const surface = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    const annualProduction = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    const contractDuration = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    );
    const developer = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    );
    const futureOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    );
    const operator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    );
    const reinstatementOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    );
    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    const financialAssistance = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
    );
    const reinstatementExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
    );
    const installationExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
    const yearlyExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
    );
    const yearlyRevenues = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
    );
    const schedule = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
    const decontamination = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );

    return {
      projectData: {
        name: naming?.name ?? "",
        description: naming?.description,
        developmentPlanCategory: "RENEWABLE_ENERGY",
        renewableEnergy: "PHOTOVOLTAIC_POWER_PLANT",
        photovoltaicElectricalPowerKWc: power?.photovoltaicInstallationElectricalPowerKWc ?? 0,
        photovoltaicSurfaceArea: surface?.photovoltaicInstallationSurfaceSquareMeters ?? 0,
        photovoltaicExpectedAnnualProduction:
          annualProduction?.photovoltaicExpectedAnnualProduction ?? 0,
        photovoltaicContractDuration: contractDuration?.photovoltaicContractDuration ?? 0,
        soilsDistribution,
        soilsCarbonStorage: soilsCarbonStorage.projected,
        projectDeveloper: developer?.projectDeveloper?.name,
        futureOwner: futureOwner?.futureSiteOwner?.name,
        futureOperator: operator?.futureOperator?.name,
        reinstatementContractOwner: reinstatementOwner?.reinstatementContractOwner?.name,
        sitePurchaseTotalCost: sitePurchase?.sellingPrice
          ? sitePurchase.sellingPrice + (sitePurchase.propertyTransferDuties ?? 0)
          : 0,
        financialAssistanceRevenues: financialAssistance?.financialAssistanceRevenues,
        reinstatementExpenses: reinstatementExpenses?.reinstatementExpenses ?? [],
        photovoltaicPanelsInstallationExpenses:
          installationExpenses?.photovoltaicPanelsInstallationExpenses,
        yearlyProjectedExpenses: yearlyExpenses?.yearlyProjectedExpenses ?? [],
        yearlyProjectedRevenues: yearlyRevenues?.yearlyProjectedRevenues ?? [],
        reinstatementSchedule: schedule?.reinstatementSchedule,
        photovoltaicInstallationSchedule: schedule?.photovoltaicInstallationSchedule,
        decontaminatedSurfaceArea:
          decontamination?.decontaminatedSurfaceArea ??
          decontaminationSelection?.decontaminatedSurfaceArea,
        firstYearOfOperation: schedule?.firstYearOfOperation,
      },
      siteData: {
        surfaceArea: siteData?.surfaceArea ?? 0,
        soilsDistribution: siteData?.soilsDistribution ?? {},
        soilsCarbonStorage: soilsCarbonStorage.current,
        name: siteData?.name ?? "",
      },
    };
  },
);
