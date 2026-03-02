import { RootState } from "@/app/store/store";
import { getProjectFormInitialState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { selectPVReinstatementExpensesViewData } from "../selectors/expenses.selectors";
import { selectPhotovoltaicSummaryViewData } from "../selectors/photovoltaicPowerStation.selectors";
import {
  selectPVDecontaminationSurfaceAreaViewData,
  selectPVScheduleProjectionViewData,
} from "../selectors/renewableEnergy.selector";
import { selectPVYearlyProjectedRevenueViewData } from "../selectors/revenues.selectors";
import {
  selectPVClimateAndBiodiversityImpactNoticeViewData,
  selectPVNonSuitableSoilsNoticeViewData,
  selectPVSoilsSummaryViewData,
} from "../selectors/soilsTransformation.selectors";
import {
  selectPVDeveloperViewData,
  selectPVOperatorViewData,
} from "../selectors/stakeholders.selectors";
import { projectWithExhaustiveData } from "./projectData.mock";

const siteData = {
  ...relatedSiteData,
  nature: "FRICHE" as const,
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 5000,
  soilsDistribution: {
    BUILDINGS: 3000,
    MINERAL_SOIL: 5000,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
  },
};

const buildState = (
  overrides: Partial<typeof projectWithExhaustiveData> = {},
): RootState["projectCreation"] =>
  ({
    stepsHistory: ["PROJECT_TYPE_SELECTION"],
    projectId: "",
    siteData,
    siteDataLoadingState: "success",
    siteRelatedLocalAuthorities: { loadingState: "idle" },
    renewableEnergyProject: {
      expressData: { loadingState: "idle" },
      createMode: "custom",
      creationData: { ...projectWithExhaustiveData, ...overrides },
      expectedPhotovoltaicPerformance: { loadingState: "idle" },
      saveState: "idle",
      soilsCarbonStorage: {
        loadingState: "idle",
        current: undefined,
        projected: undefined,
      },
    },
    urbanProject: getProjectFormInitialState("URBAN_PROJECT_CREATE_MODE_SELECTION").urbanProject,
    surfaceAreaInputMode: "percentage",
  }) satisfies RootState["projectCreation"];

const MOCK_STATE = {
  projectCreation: buildState(),
  currentUser: {
    currentUser: {
      id: "user-1",
      email: "test@example.com",
      structureName: "My company",
      structureType: "company" as const,
    },
    currentUserLoaded: true,
    createUserState: "success" as const,
  },
} as unknown as RootState;

describe("Photovoltaic ViewData selectors", () => {
  describe("selectPVDeveloperViewData", () => {
    it("returns available stakeholders lists", () => {
      const viewData = selectPVDeveloperViewData(MOCK_STATE);
      expect(viewData).toHaveProperty("availableStakeholdersList");
      expect(viewData).toHaveProperty("availableLocalAuthoritiesStakeholders");
      expect(Array.isArray(viewData.availableStakeholdersList)).toBe(true);
      expect(Array.isArray(viewData.availableLocalAuthoritiesStakeholders)).toBe(true);
    });
  });

  describe("selectPVOperatorViewData", () => {
    it("returns currentUser structure and futureOperator initialValue", () => {
      const viewData = selectPVOperatorViewData(MOCK_STATE);
      expect(viewData.currentUser).toEqual({
        name: "My company",
        type: "company",
        activity: undefined,
      });
      expect(viewData.initialValue).toEqual(projectWithExhaustiveData.futureOperator);
    });
  });

  describe("selectPhotovoltaicSummaryViewData", () => {
    it("returns projectData, siteData and soils carbon storage", () => {
      const viewData = selectPhotovoltaicSummaryViewData(MOCK_STATE);
      expect(viewData).toEqual({
        projectData: projectWithExhaustiveData,
        siteData,
        siteSoilsCarbonStorage: undefined,
        projectSoilsCarbonStorage: undefined,
      });
    });
  });

  describe("selectPVSoilsSummaryViewData", () => {
    it("returns site and project soils distributions", () => {
      const viewData = selectPVSoilsSummaryViewData(MOCK_STATE);
      expect(viewData).toEqual({
        siteSoilsDistribution: siteData.soilsDistribution,
        projectSoilsDistribution: projectWithExhaustiveData.soilsDistribution,
      });
    });
  });

  describe("selectPVNonSuitableSoilsNoticeViewData", () => {
    it("returns photovoltaic panels surface area and suitable surface area", () => {
      const viewData = selectPVNonSuitableSoilsNoticeViewData(MOCK_STATE);
      expect(viewData).toHaveProperty("photovoltaicPanelsSurfaceArea");
      expect(viewData).toHaveProperty("suitableSurfaceArea");
      expect(typeof viewData.photovoltaicPanelsSurfaceArea).toBe("number");
      expect(typeof viewData.suitableSurfaceArea).toBe("number");
    });
  });

  describe("selectPVClimateAndBiodiversityImpactNoticeViewData", () => {
    it("returns biodiversity impact data", () => {
      const viewData = selectPVClimateAndBiodiversityImpactNoticeViewData(MOCK_STATE);
      expect(viewData).toHaveProperty("hasTransformationNegativeImpact");
      expect(viewData).toHaveProperty("biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed");
      expect(viewData).toHaveProperty("futureBiodiversityAndClimateSensitiveSoilsSurfaceArea");
    });
  });

  describe("selectPVDecontaminationSurfaceAreaViewData", () => {
    it("returns contaminated surface area and percentage to decontaminate", () => {
      const viewData = selectPVDecontaminationSurfaceAreaViewData(MOCK_STATE);
      expect(viewData).toEqual({
        contaminatedSurfaceArea: 5000,
        surfaceAreaToDecontaminateInPercentage: expect.any(Number),
      });
    });
  });

  describe("selectPVScheduleProjectionViewData", () => {
    it("returns schedule initial values and whether site is friche", () => {
      const viewData = selectPVScheduleProjectionViewData(MOCK_STATE);
      expect(viewData).toHaveProperty("initialValues");
      expect(viewData.siteIsFriche).toBe(true);
    });
  });

  describe("selectPVReinstatementExpensesViewData", () => {
    it("returns soils distributions, decontaminated surface area and reinstatement expenses", () => {
      const viewData = selectPVReinstatementExpensesViewData(MOCK_STATE);
      expect(viewData).toEqual({
        siteSoilsDistribution: siteData.soilsDistribution,
        projectSoilsDistribution: projectWithExhaustiveData.soilsDistribution,
        decontaminatedSurfaceArea: projectWithExhaustiveData.decontaminatedSurfaceArea,
        reinstatementExpenses: projectWithExhaustiveData.reinstatementExpenses,
      });
    });
  });

  describe("selectPVYearlyProjectedRevenueViewData", () => {
    it("returns initial values and photovoltaic expected annual production", () => {
      const viewData = selectPVYearlyProjectedRevenueViewData(MOCK_STATE);
      expect(viewData).toHaveProperty("initialValues");
      expect(viewData.photovoltaicExpectedAnnualProduction).toBe(
        projectWithExhaustiveData.photovoltaicExpectedAnnualProduction,
      );
    });
  });
});
