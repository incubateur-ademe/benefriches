import { createReducer } from "@reduxjs/toolkit";
import { DevelopmentPlanType, ProjectPhase } from "shared";

import { addWizardFormCasesToBuilder } from "@/features/create-project/core/project-form/siteRelatedLocalAuthorities.action";
import {
  answerStepHandlers,
  stepHandlerRegistry,
} from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { addUrbanProjectFormCasesToBuilder } from "@/features/create-project/core/urban-project/urbanProjectForm.reducer";
import {
  getWizardFormInitialState,
  WizardFormState,
} from "@/features/create-project/core/urban-project/urbanProjectForm.state";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { convertProjectDataToSteps } from "./helpers/convertProjectDataToSteps";
import {
  reconversionProjectUpdateInitiated,
  reconversionProjectUpdateSaved,
  updateProjectFormActions,
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

type ProjectUpdateState = WizardFormState<UrbanProjectUpdateStep> & {
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
    ...getWizardFormInitialState<UrbanProjectUpdateStep>("URBAN_PROJECT_USES_INTRODUCTION"),
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
    selectForm: (state) => state.urbanProject,
    buildContext: (state) => ({ siteData: state.siteData }),
  });

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

      state.urbanProject.steps = convertProjectDataToSteps(action.payload);
      state.urbanProject.currentStep = "URBAN_PROJECT_FINAL_SUMMARY";
      state.urbanProject.saveState = "idle";

      state.urbanProject.stepsSequence = computeStepsSequence(
        {
          context: { siteData: action.payload.siteData },
          answers: state.urbanProject.steps,
        },
        state.urbanProject.firstSequenceStep,
        stepHandlerRegistry,
      );
    })
    .addCase(reconversionProjectUpdateInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
      state.projectData.loadingState = "error";
    });

  builder.addCase(reconversionProjectUpdateSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(reconversionProjectUpdateSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
    state.projectData.projectName = state.urbanProject.steps.URBAN_PROJECT_NAMING?.payload?.name;
    state.projectData.updatedAt = new Date().toISOString();
  });
  builder.addCase(reconversionProjectUpdateSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
});

export default projectUpdateReducer;
