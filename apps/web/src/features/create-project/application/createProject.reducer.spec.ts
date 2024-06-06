import { InMemorySaveReconversionProjectService } from "../infrastructure/save-project-service/InMemorySaveReconversionProjectService";
import { getInitialState } from "./createProject.reducer";
import { projectWithExhaustiveData, projectWithMinimalData } from "./projectData.mock";
import { saveReconversionProject } from "./saveReconversionProject.action";
import { relatedSiteData } from "./siteData.mock";

import { createStore, RootState } from "@/app/application/store";
import { buildUser } from "@/features/users/domain/user.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

describe("createProject reducer", () => {
  describe("saveReconversionProject action", () => {
    it("should result in error state when no related site data", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        projectData: projectWithMinimalData,
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
      expect(state.projectCreation).toEqual({
        ...initialState,
        stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
        saveProjectLoadingState: "error",
      });
    });

    it("should result in error state when no user id in store", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        projectData: projectWithMinimalData,
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
      expect(state.projectCreation).toEqual({
        ...initialState,
        stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
        saveProjectLoadingState: "error",
      });
    });

    it.each([
      { case: "no id", dataProp: "id", invalidValue: undefined },
      { case: "no name", dataProp: "name", invalidValue: undefined },
      { case: "no projectPhase", dataProp: "projectPhase", invalidValue: undefined },
      {
        case: "no development plan developer",
        dataProp: "projectDeveloper",
        invalidValue: undefined,
      },
      {
        case: "no development plan cost",
        dataProp: "photovoltaicPanelsInstallationCost",
        invalidValue: undefined,
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
        case: "no yearlyProjectedCosts",
        dataProp: "yearlyProjectedCosts",
        invalidValue: undefined,
      },
      {
        case: "negative amount in yearlyProjectedCosts",
        dataProp: "yearlyProjectedCosts",
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
        case: "negative realEstateTransactionSellingPrice",
        dataProp: "realEstateTransactionSellingPrice",
        invalidValue: -1,
      },
      {
        case: "negative realEstateTransactionPropertyTransferDuties",
        dataProp: "realEstateTransactionPropertyTransferDuties",
        invalidValue: -1,
      },
      {
        case: "negative amount in reinstatementCosts",
        dataProp: "reinstatementCosts",
        invalidValue: { total: -1, costs: [{ amount: -1, purpose: "demolition" }] },
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
          projectData: projectCreationData,
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
        expect(state.projectCreation).toEqual({
          ...initialState,
          stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
          saveProjectLoadingState: "error",
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
        projectData: projectWithMinimalData,
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
      expect(state.projectCreation).toEqual({
        ...initialState,
        stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
        saveProjectLoadingState: "error",
      });
    });

    it.each([
      { case: "reconversion project with minimal data", data: projectWithMinimalData },
      { case: "reconversion project with exaustive data", data: projectWithExhaustiveData },
    ])("should be in success state when everything went ok", async () => {
      const initialState: RootState["projectCreation"] = {
        ...getInitialState(),
        siteData: relatedSiteData,
        projectData: projectWithMinimalData,
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
      expect(state.projectCreation).toEqual({
        ...initialState,
        stepsHistory: [...initialState.stepsHistory, "CREATION_CONFIRMATION"],
        saveProjectLoadingState: "success",
      });
    });
  });
});
