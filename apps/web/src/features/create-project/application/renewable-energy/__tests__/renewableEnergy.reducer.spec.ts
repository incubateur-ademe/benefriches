import { createStore, RootState } from "@/app/application/store";
import { buildUser } from "@/features/users/domain/user.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemorySaveReconversionProjectService } from "../../../infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getInitialState } from "../../createProject.reducer";
import { saveReconversionProject } from "../saveReconversionProject.action";
import { projectWithExhaustiveData, projectWithMinimalData } from "./projectData.mock";

describe("renewableEnergy.reducer.spec reducer", () => {
  describe("saveReconversionProject action", () => {
    it("should result in error state when no related site data", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          creationData: projectWithMinimalData,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
        saveState: "error",
      });
    });

    it("should result in error state when no user id in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          creationData: projectWithMinimalData,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: null,
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
        saveState: "error",
      });
    });

    it("should result in error state when no projectId in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        projectId: "",
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          creationData: projectWithMinimalData,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: null,
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
        saveState: "error",
      });
    });

    it.each([
      { case: "no name", dataProp: "name", invalidValue: undefined },
      { case: "no projectPhase", dataProp: "projectPhase", invalidValue: undefined },
      {
        case: "no development plan developer",
        dataProp: "projectDeveloper",
        invalidValue: undefined,
      },
      {
        case: "negative amount in photovoltaic installation expenses",
        dataProp: "photovoltaicPanelsInstallationExpenses",
        invalidValue: [{ amount: -1, purpose: "installation_works" }],
      },
      {
        case: "no development plan surface area",
        dataProp: "photovoltaicInstallationSurfaceSquareMeters",
        invalidValue: undefined,
      },
      {
        case: "no development plan photovoltaicInstallationElectricalPowerKWc",
        dataProp: "photovoltaicInstallationElectricalPowerKWc",
        invalidValue: undefined,
      },
      {
        case: "no development plan photovoltaicExpectedAnnualProduction",
        dataProp: "photovoltaicExpectedAnnualProduction",
        invalidValue: undefined,
      },
      {
        case: "no development plan photovoltaicContractDuration",
        dataProp: "photovoltaicContractDuration",
        invalidValue: undefined,
      },
      {
        case: "no yearlyProjectedExpenses",
        dataProp: "yearlyProjectedExpenses",
        invalidValue: undefined,
      },
      {
        case: "negative amount in yearlyProjectedExpenses",
        dataProp: "yearlyProjectedExpenses",
        invalidValue: [{ amount: -1, purpose: "rent" }],
      },
      {
        case: "no yearlyProjectedRevenues",
        dataProp: "yearlyProjectedRevenues",
        invalidValue: undefined,
      },
      {
        case: "negative amount in yearlyProjectedRevenues",
        dataProp: "yearlyProjectedRevenues",
        invalidValue: [{ amount: -1, source: "operations" }],
      },
      {
        case: "negative amount in financialAssistanceRevenues",
        dataProp: "financialAssistanceRevenues",
        invalidValue: [{ amount: -1, source: "public_subsidies" }],
      },
      { case: "no soilsDistribution", dataProp: "soilsDistribution", invalidValue: undefined },
      {
        case: "negative conversionFullTimeJobsInvolved",
        dataProp: "conversionFullTimeJobsInvolved",
        invalidValue: -1,
      },
      {
        case: "negative reinstatementFullTimeJobsInvolved",
        dataProp: "reinstatementFullTimeJobsInvolved",
        invalidValue: -1,
      },
      {
        case: "negative operationsFullTimeJobsInvolved",
        dataProp: "operationsFullTimeJobsInvolved",
        invalidValue: -1,
      },
      {
        case: "negative sitePurchaseSellingPrice",
        dataProp: "sitePurchaseSellingPrice",
        invalidValue: -1,
      },
      {
        case: "negative sitePurchasePropertyTransferDuties",
        dataProp: "sitePurchasePropertyTransferDuties",
        invalidValue: -1,
      },
      {
        case: "negative amount in reinstatementExpenses",
        dataProp: "reinstatementExpenses",
        invalidValue: [{ amount: -1, purpose: "demolition" }],
      },
      {
        case: "invalid reinstatementSchedule",
        dataProp: "reinstatementSchedule",
        invalidValue: { invalidSchedule: true },
      },
      { case: "negative operationsFirstYear", dataProp: "firstYearOfOperation", invalidValue: -1 },
      { case: "invalid futureOperator", dataProp: "futureOperator", invalidValue: { name: "" } },
      { case: "invalid futureSiteOwner", dataProp: "futureSiteOwner", invalidValue: { name: "" } },
      {
        case: "invalid reinstatementContractOwner",
        dataProp: "reinstatementContractOwner",
        invalidValue: { name: "" },
      },
    ])(
      "should result in error state when invalid project data: $case",
      async ({ dataProp, invalidValue }) => {
        const projectCreationData = {
          ...projectWithMinimalData,
          [dataProp]: invalidValue,
        };
        const initialState: RootState["projectCreation"] = {
          ...getInitialState(),
          siteData: relatedSiteData,
          renewableEnergyProject: {
            ...getInitialState().renewableEnergyProject,
            creationData: projectCreationData,
          },
        };

        const store = createStore(getTestAppDependencies(), {
          projectCreation: initialState,
          currentUser: {
            currentUser: buildUser(),
            createUserState: "idle",
            currentUserLoaded: true,
          },
        });
        const actionResult = await store.dispatch(saveReconversionProject());

        const state = store.getState();
        expect(state.projectCreation.renewableEnergyProject).toEqual({
          ...initialState.renewableEnergyProject,
          stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
          saveState: "error",
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
          creationData: projectWithMinimalData,
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
            currentUserLoaded: true,
          },
        },
      );
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
        saveState: "error",
      });
    });

    it.each([
      { case: "reconversion project with minimal data", data: projectWithMinimalData },
      { case: "reconversion project with exaustive data", data: projectWithExhaustiveData },
    ])("should be in success state when everything went ok", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        renewableEnergyProject: {
          ...getInitialState().renewableEnergyProject,
          creationData: projectWithMinimalData,
        },
      };

      const store = createStore(getTestAppDependencies(), {
        projectCreation: initialState,
        currentUser: {
          currentUser: buildUser(),
          createUserState: "idle",
          currentUserLoaded: true,
        },
      });
      await store.dispatch(saveReconversionProject());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject).toEqual({
        ...initialState.renewableEnergyProject,
        stepsHistory: [...initialState.renewableEnergyProject.stepsHistory, "CREATION_RESULT"],
        saveState: "success",
      });
    });
  });
});
