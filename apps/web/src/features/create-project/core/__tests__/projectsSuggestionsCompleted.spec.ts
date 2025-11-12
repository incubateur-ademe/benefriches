import { buildUser } from "@/features/onboarding/core/user.mock";
import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { InMemoryCreateExpressReconversionProjectService } from "../../infrastructure/create-express-project-service/InMemoryCreateExpressReconversionProjectService";
import {
  mockedGeneratedPhotovoltaicProject,
  mockedGeneratedUrbanProject,
} from "../../infrastructure/create-express-project-service/mocks";
import { projectSuggestionsCompleted } from "../actions/projectSuggestionCompleted.action";
import {
  INITIAL_STATE,
  RenewableEnergyProjectState,
} from "../renewable-energy/renewableEnergy.reducer";
import { relatedSiteData } from "./siteData.mock";
import { expectNewCurrentStep, StoreBuilder } from "./testUtils";

describe("Reconversion project suggestions step completed", () => {
  it("should go to project type selection when suggestions are ignored", async () => {
    const store = new StoreBuilder().withStepsHistory(["PROJECT_SUGGESTIONS"]).build();
    const initialState = store.getState();

    store.dispatch(projectSuggestionsCompleted({ selectedOption: "none" }));

    expectNewCurrentStep(initialState, store.getState(), "PROJECT_TYPE_SELECTION");
  });

  it("should create a photovoltaic power plant project from template when selected and go to express generation summary", async () => {
    const expressPhotovoltaicProjectCreateService =
      new InMemoryCreateExpressReconversionProjectService([mockedGeneratedPhotovoltaicProject]);
    const store = new StoreBuilder()
      .withRelatedSiteData(relatedSiteData)
      .withCurrentUser(buildUser())
      .withStepsHistory(["PROJECT_SUGGESTIONS"])
      .withAppDependencies({
        createExpressReconversionProjectService: expressPhotovoltaicProjectCreateService,
      })
      .build();
    const initialState = store.getState();

    store.dispatch(projectSuggestionsCompleted({ selectedOption: "PHOTOVOLTAIC_POWER_PLANT" }));

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newState = store.getState();
    expectNewCurrentStep(initialState, newState, "RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY");
    expect(newState.projectCreation.developmentPlanCategory).toEqual("RENEWABLE_ENERGY");
    expect(newState.projectCreation.renewableEnergyProject).toEqual<RenewableEnergyProjectState>({
      ...INITIAL_STATE,
      expressData: {
        loadingState: "success",
        projectData: mockedGeneratedPhotovoltaicProject,
      },
      createMode: "express",
      saveState: "idle",
    });
  });

  it("should create an urban project from offices template when selected and go to express generation summary", async () => {
    const expressUrbanProjectCreateService = new InMemoryCreateExpressReconversionProjectService([
      mockedGeneratedUrbanProject,
    ]);
    const store = new StoreBuilder()
      .withRelatedSiteData(relatedSiteData)
      .withCurrentUser(buildUser())
      .withStepsHistory(["PROJECT_SUGGESTIONS"])
      .withAppDependencies({
        createExpressReconversionProjectService: expressUrbanProjectCreateService,
      })
      .build();
    const initialState = store.getState();

    store.dispatch(projectSuggestionsCompleted({ selectedOption: "OFFICES" }));

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newState = store.getState();
    expectNewCurrentStep(initialState, newState, "URBAN_PROJECT_EXPRESS_SUMMARY");
    expect(newState.projectCreation.developmentPlanCategory).toEqual("URBAN_PROJECT");
    expect(newState.projectCreation.urbanProject).toEqual<ProjectFormState["urbanProject"]>({
      currentStep: "URBAN_PROJECT_EXPRESS_SUMMARY",
      pendingStepCompletion: undefined,
      steps: {
        URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: {
          completed: true,
          payload: {
            projectTemplate: "OFFICES",
          },
        },
        URBAN_PROJECT_CREATE_MODE_SELECTION: {
          completed: true,
          payload: {
            createMode: "express",
          },
        },
        URBAN_PROJECT_EXPRESS_SUMMARY: {
          completed: false,
          loadingState: "success",
          data: mockedGeneratedUrbanProject,
        },
      },
      saveState: "idle",
      stepsSequence: [
        "URBAN_PROJECT_CREATE_MODE_SELECTION",
        "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION",
        "URBAN_PROJECT_EXPRESS_SUMMARY",
        "URBAN_PROJECT_EXPRESS_CREATION_RESULT",
      ],
      firstSequenceStep: "URBAN_PROJECT_CREATE_MODE_SELECTION",
    });
  });
});
