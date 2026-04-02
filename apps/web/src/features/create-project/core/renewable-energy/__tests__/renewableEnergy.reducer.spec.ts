import { createStore, RootState } from "@/app/store/store";
import { buildUser } from "@/features/onboarding/core/user.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemorySaveReconversionProjectService } from "../../../infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getInitialState } from "../../createProject.reducer";
import { saveReconversionProject } from "../actions/customProjectSaved.action";
import { exhaustiveSteps, minimalSteps, withStepPayload } from "./projectData.mock";

describe("renewableEnergy.reducer.spec reducer", () => {
  describe("saveReconversionProject action", () => {
    it("should result in error state when no related site data", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps: minimalSteps,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserState: "authenticated",
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject.currentStep).toEqual(
        "RENEWABLE_ENERGY_CREATION_RESULT",
      );
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "error",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });

    it("should result in error state when no user id in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps: minimalSteps,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: null,
          createUserState: "idle",
          currentUserState: "authenticated",
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "error",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });

    it("should result in error state when no projectId in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        projectId: "",
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps: minimalSteps,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: null,
          createUserState: "idle",
          currentUserState: "authenticated",
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "error",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });

    it("should result in error state when no projectPhase in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        projectId: "",
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps: minimalSteps,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: null,
          createUserState: "idle",
          currentUserState: "authenticated",
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "error",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });

    it.each([
      {
        case: "no name",
        stepId: "RENEWABLE_ENERGY_NAMING" as const,
        invalidPayload: undefined,
      },
      {
        case: "no development plan developer",
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER" as const,
        invalidPayload: undefined,
      },
      {
        case: "negative amount in photovoltaic installation expenses",
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION" as const,
        invalidPayload: {
          photovoltaicPanelsInstallationExpenses: [{ amount: -1, purpose: "installation_works" }],
        },
      },
      {
        case: "no development plan surface area",
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE" as const,
        invalidPayload: undefined,
      },
      {
        case: "no development plan photovoltaicInstallationElectricalPowerKWc",
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER" as const,
        invalidPayload: undefined,
      },
      {
        case: "no development plan photovoltaicExpectedAnnualProduction",
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION" as const,
        invalidPayload: undefined,
      },
      {
        case: "no development plan photovoltaicContractDuration",
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION" as const,
        invalidPayload: undefined,
      },
      {
        case: "no yearlyProjectedExpenses",
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES" as const,
        invalidPayload: undefined,
      },
      {
        case: "negative amount in yearlyProjectedExpenses",
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES" as const,
        invalidPayload: {
          yearlyProjectedExpenses: [{ amount: -1, purpose: "rent" }],
        },
      },
      {
        case: "no yearlyProjectedRevenues",
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE" as const,
        invalidPayload: undefined,
      },
      {
        case: "negative amount in yearlyProjectedRevenues",
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE" as const,
        invalidPayload: {
          yearlyProjectedRevenues: [{ amount: -1, source: "operations" }],
        },
      },
      {
        case: "negative amount in financialAssistanceRevenues",
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE" as const,
        invalidPayload: {
          financialAssistanceRevenues: [{ amount: -1, source: "public_subsidies" }],
        },
      },
      {
        case: "invalid soilsDistribution",
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION" as const,
        invalidPayload: {
          soilsTransformationProject: "custom",
          soilsDistribution: [{ soilType: "unknown" }],
        },
      },
      {
        case: "negative sitePurchaseSellingPrice",
        stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS" as const,
        invalidPayload: { sellingPrice: -1 },
      },
      {
        case: "negative sitePurchasePropertyTransferDuties",
        stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS" as const,
        invalidPayload: { sellingPrice: 100, propertyTransferDuties: -1 },
      },
      {
        case: "negative amount in reinstatementExpenses",
        stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT" as const,
        invalidPayload: {
          reinstatementExpenses: [{ amount: -1, purpose: "demolition" }],
        },
      },
      {
        case: "invalid reinstatementSchedule",
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION" as const,
        invalidPayload: { reinstatementSchedule: { invalidSchedule: true } },
      },
      {
        case: "negative operationsFirstYear",
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION" as const,
        invalidPayload: { firstYearOfOperation: -1 },
      },
      {
        case: "invalid futureOperator",
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR" as const,
        invalidPayload: { futureOperator: { name: "" } },
      },
      {
        case: "invalid futureSiteOwner",
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER" as const,
        invalidPayload: { futureSiteOwner: { name: "" } },
      },
      {
        case: "invalid reinstatementContractOwner",
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER" as const,
        invalidPayload: { reinstatementContractOwner: { name: "" } },
      },
    ])(
      "should result in error state when invalid project data: $case",
      async ({ stepId, invalidPayload }) => {
        const steps = withStepPayload(minimalSteps, stepId, invalidPayload);
        const initialState: RootState["projectCreation"] = {
          ...getInitialState(),
          siteData: relatedSiteData,
          renewableEnergyProject: {
            ...getInitialState().renewableEnergyProject,
            steps,
          },
        };

        const store = createStore(getTestAppDependencies(), {
          projectCreation: initialState,
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserState: "authenticated",
          },
        });
        const actionResult = await store.dispatch(saveReconversionProject());

        const state = store.getState();
        expect(state.projectCreation.renewableEnergyProject).toEqual({
          ...initialState.renewableEnergyProject,
          saveState: "error",
          currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
        });
        expect(
          (actionResult as typeof actionResult & { error: { name: string } }).error.name,
        ).toEqual("ZodError");
      },
    );

    it("should be in error state when createSiteService fails", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps: minimalSteps,
        },
      };

      const shouldFail = true;
      const store = createStore(
        getTestAppDependencies({
          saveReconversionProjectService: new InMemorySaveReconversionProjectService(shouldFail),
        }),
        {
          projectCreation: initialState,
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserState: "authenticated",
          },
        },
      );
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "error",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });

    it.each([
      { case: "reconversion project with minimal data", steps: minimalSteps },
      { case: "reconversion project with exhaustive data", steps: exhaustiveSteps },
    ])("should be in success state when everything went ok: $case", async ({ steps }) => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        useCaseSelection: {
          projectPhase: "planning",
          stepsSequence: [],
          currentStep: "USE_CASE_SELECTION_CREATION_MODE",
        },
        siteData: relatedSiteData,
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          steps,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserState: "authenticated",
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        saveState: "success",
        currentStep: "RENEWABLE_ENERGY_CREATION_RESULT",
      });
    });
  });
});
