import { createReducer } from "@reduxjs/toolkit";
import { DevelopmentPlanType, ProjectPhase } from "shared";

import {
  ProjectSiteView,
  SiteRelatedLocalAuthorities,
} from "@/features/create-project/core/project-form/projectSite.types";
import { addWizardFormCasesToBuilder } from "@/features/create-project/core/project-form/siteRelatedLocalAuthorities.action";
import {
  INITIAL_STATE as renewableEnergyInitialState,
  RenewableEnergyProjectState,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.reducer";
import { addRenewableEnergyFormCasesToBuilder } from "@/features/create-project/core/renewable-energy/renewableEnergyForm.reducer";
import {
  answerStepHandlers as renewableEnergyAnswerStepHandlers,
  stepHandlerRegistry as renewableEnergyStepHandlerRegistry,
} from "@/features/create-project/core/renewable-energy/step-handlers/stepHandlerRegistry";
import {
  answerStepHandlers,
  stepHandlerRegistry,
} from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import {
  getUrbanProjectInitialState,
  UrbanProjectState,
} from "@/features/create-project/core/urban-project/urbanProject.state";
import { addUrbanProjectFormCasesToBuilder } from "@/features/create-project/core/urban-project/urbanProjectForm.reducer";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { convertPhotovoltaicProjectDataToSteps } from "./helpers/convertPhotovoltaicProjectDataToSteps";
import { convertProjectDataToSteps } from "./helpers/convertProjectDataToSteps";
import {
  reconversionProjectUpdateInitiated,
  reconversionProjectUpdateSaved,
  updateProjectFormActions,
  updateProjectFormRenewableEnergyActions,
  updateProjectFormUrbanActions,
} from "./updateProject.actions";

export type UrbanProjectUpdateStep = Exclude<
  UrbanProjectCreationStep,
  | "URBAN_PROJECT_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_SUMMARY"
  | "URBAN_PROJECT_CREATE_MODE_SELECTION"
  | "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION"
>;

type ProjectUpdateState = {
  siteData?: ProjectSiteView;
  siteDataLoadingState: "idle" | "loading" | "success" | "error";
  siteRelatedLocalAuthorities: SiteRelatedLocalAuthorities;
  urbanProject: UrbanProjectState<UrbanProjectUpdateStep>;
  renewableEnergyProject: RenewableEnergyProjectState;
  projectData: {
    id?: string;
    loadingState: "idle" | "success" | "error" | "loading";
    updatedAt?: string;
    projectName?: string;
    isExpress?: boolean;
    projectType?: DevelopmentPlanType;
    projectPhase?: ProjectPhase;
  };
};

const getInitialState = (): ProjectUpdateState => {
  return {
    projectData: {
      loadingState: "idle",
    },
    renewableEnergyProject: renewableEnergyInitialState,
    siteData: undefined,
    siteDataLoadingState: "idle",
    siteRelatedLocalAuthorities: {
      loadingState: "idle",
    },
    urbanProject: getUrbanProjectInitialState<UrbanProjectUpdateStep>(
      "URBAN_PROJECT_USES_INTRODUCTION",
    ),
  };
};

const projectUpdateReducer = createReducer(getInitialState(), (builder) => {
  addWizardFormCasesToBuilder(builder, updateProjectFormActions);

  addUrbanProjectFormCasesToBuilder(builder, updateProjectFormUrbanActions, {
    config: {
      stepChangesNextMode: "next_empty",
      finalSummaryFallbackStep: "URBAN_PROJECT_FINAL_SUMMARY",
    },
    registry: answerStepHandlers,
    selectForm: (state) => state.urbanProject.form,
    buildContext: (state) => ({ siteData: state.siteData }),
  });

  addRenewableEnergyFormCasesToBuilder<ProjectUpdateState>(
    builder,
    updateProjectFormRenewableEnergyActions,
    {
      config: {
        stepChangesNextMode: "next_empty",
        finalSummaryFallbackStep: "RENEWABLE_ENERGY_FINAL_SUMMARY",
      },
      registry: renewableEnergyAnswerStepHandlers,
      selectForm: (state) => state.renewableEnergyProject,
      buildContext: (state) => ({ siteData: state.siteData }),
    },
  );

  builder
    .addCase(reconversionProjectUpdateInitiated.pending, () => {
      return {
        ...getInitialState(),
        siteDataLoadingState: "loading",
        projectData: {
          loadingState: "loading",
        },
      };
    })
    .addCase(reconversionProjectUpdateInitiated.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload.siteData;
      state.projectData = {
        id: action.payload.projectData.id,
        loadingState: "success",
        updatedAt: action.payload.projectData.updatedAt,
        projectName: action.payload.projectData.name,
        isExpress: action.payload.projectData.creationMode === "express",
        projectType: action.payload.projectData.developmentPlan.type,
        projectPhase: action.payload.projectData.projectPhase as ProjectPhase,
      };

      if (action.payload.projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT") {
        state.renewableEnergyProject.steps = convertPhotovoltaicProjectDataToSteps(action.payload);
        state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_FINAL_SUMMARY";
        state.renewableEnergyProject.saveState = "idle";

        state.renewableEnergyProject.stepsSequence = computeStepsSequence(
          {
            context: { siteData: action.payload.siteData },
            answers: state.renewableEnergyProject.steps,
          },
          state.renewableEnergyProject.firstSequenceStep,
          renewableEnergyStepHandlerRegistry,
        );
        return;
      }

      state.urbanProject.form.steps = convertProjectDataToSteps(action.payload);
      state.urbanProject.form.currentStep = "URBAN_PROJECT_FINAL_SUMMARY";
      state.urbanProject.form.saveState = "idle";

      state.urbanProject.form.stepsSequence = computeStepsSequence(
        {
          context: { siteData: action.payload.siteData },
          answers: state.urbanProject.form.steps,
        },
        state.urbanProject.form.firstSequenceStep,
        stepHandlerRegistry,
      );
    })
    .addCase(reconversionProjectUpdateInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
      state.projectData.loadingState = "error";
    });

  builder.addCase(reconversionProjectUpdateSaved.pending, (state) => {
    if (state.projectData.projectType === "PHOTOVOLTAIC_POWER_PLANT") {
      state.renewableEnergyProject.saveState = "loading";
      return;
    }
    state.urbanProject.form.saveState = "loading";
  });
  builder.addCase(reconversionProjectUpdateSaved.fulfilled, (state) => {
    if (state.projectData.projectType === "PHOTOVOLTAIC_POWER_PLANT") {
      state.renewableEnergyProject.saveState = "success";
      state.projectData.projectName =
        state.renewableEnergyProject.steps.RENEWABLE_ENERGY_NAMING?.payload?.name;
      state.projectData.updatedAt = new Date().toISOString();
      return;
    }
    state.urbanProject.form.saveState = "success";
    state.projectData.projectName =
      state.urbanProject.form.steps.URBAN_PROJECT_NAMING?.payload?.name;
    state.projectData.updatedAt = new Date().toISOString();
  });
  builder.addCase(reconversionProjectUpdateSaved.rejected, (state) => {
    if (state.projectData.projectType === "PHOTOVOLTAIC_POWER_PLANT") {
      state.renewableEnergyProject.saveState = "error";
      return;
    }
    state.urbanProject.form.saveState = "error";
  });

  builder.addCase(
    updateProjectFormRenewableEnergyActions
      .fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.pending,
    (state) => {
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "loading";
    },
  );
  builder.addCase(
    updateProjectFormRenewableEnergyActions
      .fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.fulfilled,
    (state, action) => {
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "success";
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.expectedPerformanceMwhPerYear =
        action.payload.expectedPerformanceMwhPerYear;
    },
  );
  builder.addCase(
    updateProjectFormRenewableEnergyActions
      .fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.rejected,
    (state) => {
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "error";
    },
  );

  builder.addCase(
    updateProjectFormRenewableEnergyActions.fetchCurrentAndProjectedSoilsCarbonStorage.pending,
    (state) => {
      state.renewableEnergyProject.soilsCarbonStorage.loadingState = "loading";
    },
  );
  builder.addCase(
    updateProjectFormRenewableEnergyActions.fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled,
    (state, action) => {
      state.renewableEnergyProject.soilsCarbonStorage = {
        loadingState: "success",
        current: action.payload.current,
        projected: action.payload.projected,
      };
    },
  );
  builder.addCase(
    updateProjectFormRenewableEnergyActions.fetchCurrentAndProjectedSoilsCarbonStorage.rejected,
    (state) => {
      state.renewableEnergyProject.soilsCarbonStorage.loadingState = "error";
    },
  );
});

export default projectUpdateReducer;
