import { rootReducer } from "@/app/store/rootReducer";
import type { RootState } from "@/app/store/store";
import { getProjectFormInitialState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { DEMO_INITIAL_STATE } from "../../demo/demoProject.reducer";
import { USE_CASE_SELECTION_INITIAL_STATE } from "../../usecase-selection/useCaseSelection.reducer";
import { INITIAL_STATE } from "../renewableEnergy.reducer";
import { selectPVReinstatementExpensesViewData } from "../step-handlers/expenses/expenses-reinstatement/expensesReinstatement.selector";
import { selectPVYearlyProjectedRevenueViewData } from "../step-handlers/revenue/revenue-yearly-projected/revenueYearlyProjected.selector";
import { selectPVScheduleProjectionViewData } from "../step-handlers/schedule/schedule-projection/scheduleProjection.selector";
import { selectPVDecontaminationSurfaceAreaViewData } from "../step-handlers/soils-decontamination/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.selector";
import { selectPVClimateAndBiodiversityImpactNoticeViewData } from "../step-handlers/soils-transformation/soils-transformation-climate-and-biodiversity-impact-notice/soilsTransformationClimateAndBiodiversityImpactNotice.selector";
import { selectPVNonSuitableSoilsNoticeViewData } from "../step-handlers/soils-transformation/soils-transformation-non-suitable-soils-notice/soilsTransformationNonSuitableSoilsNotice.selector";
import { selectPVSoilsSummaryViewData } from "../step-handlers/soils-transformation/soils-transformation-soils-summary/soilsTransformationSoilsSummary.selector";
import { selectPVOperatorViewData } from "../step-handlers/stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.selector";
import { selectPVDeveloperViewData } from "../step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.selector";
import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";
import { exhaustiveSteps } from "./projectData.mock";

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

const initialRootState = rootReducer(undefined, { type: "@@INIT" });

const buildState = (
  stepOverrides: Partial<RenewableEnergyStepsState> = {},
): RootState["projectCreation"] =>
  ({
    projectId: "",
    siteData,
    siteDataLoadingState: "success",
    siteRelatedLocalAuthorities: { loadingState: "idle" },
    renewableEnergyProject: {
      ...INITIAL_STATE,
      createMode: "custom",
      steps: { ...exhaustiveSteps, ...stepOverrides },
    },
    urbanProject: getProjectFormInitialState("URBAN_PROJECT_USES_INTRODUCTION").urbanProject,
    surfaceAreaInputMode: "percentage",
    demoProject: DEMO_INITIAL_STATE,
    useCaseSelection: USE_CASE_SELECTION_INITIAL_STATE,
    currentProjectFlow: "USE_CASE_SELECTION",
  }) satisfies RootState["projectCreation"];

const MOCK_STATE: RootState = {
  ...initialRootState,
  projectCreation: buildState(),
  currentUser: {
    currentUser: {
      id: "user-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      structureName: "My company",
      structureType: "company" as const,
      structureActivity: "other" as const,
    },
    currentUserState: "authenticated" as const,
    createUserState: "success" as const,
  },
};

describe("Photovoltaic ViewData selectors", () => {
  describe("selectPVDeveloperViewData", () => {
    it("returns available stakeholders lists", () => {
      const viewData = selectPVDeveloperViewData(MOCK_STATE);
      expect(viewData).toEqual({
        availableStakeholdersList: expect.any(Array),
        availableLocalAuthoritiesStakeholders: expect.any(Array),
      });
      expect(viewData.availableStakeholdersList.length).toBeGreaterThan(0);
    });
  });

  describe("selectPVOperatorViewData", () => {
    it("returns currentUser structure and futureOperator initialValue", () => {
      const viewData = selectPVOperatorViewData(MOCK_STATE);
      expect(viewData).toEqual({
        currentUser: {
          name: "My company",
          type: "company",
          activity: "other",
        },
        initialValue: {
          name: "Future operating company name",
          structureType: "company",
        },
      });
    });
  });

  describe("selectPVSoilsSummaryViewData", () => {
    it("returns site and project soils distributions", () => {
      const viewData = selectPVSoilsSummaryViewData(MOCK_STATE);
      expect(viewData).toEqual({
        siteSoilsDistribution: siteData.soilsDistribution,
        projectSoilsDistribution: {
          BUILDINGS: 3000,
          ARTIFICIAL_TREE_FILLED: 5000,
          FOREST_MIXED: 60000,
          MINERAL_SOIL: 5000,
          IMPERMEABLE_SOILS: 1300,
        },
      });
    });
  });

  describe("selectPVNonSuitableSoilsNoticeViewData", () => {
    it("returns photovoltaic panels surface area and suitable surface area", () => {
      const viewData = selectPVNonSuitableSoilsNoticeViewData(MOCK_STATE);
      expect(viewData).toEqual({
        photovoltaicPanelsSurfaceArea: 40000,
        suitableSurfaceArea: 15000,
      });
    });
  });

  describe("selectPVClimateAndBiodiversityImpactNoticeViewData", () => {
    it("returns biodiversity impact data", () => {
      const viewData = selectPVClimateAndBiodiversityImpactNoticeViewData(MOCK_STATE);
      expect(viewData).toEqual({
        hasTransformationNegativeImpact: expect.any(Boolean),
        biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed: expect.any(Number),
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: expect.any(Number),
      });
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
      expect(viewData).toEqual({
        initialValues: expect.any(Object),
        siteIsFriche: true,
      });
    });
  });

  describe("selectPVReinstatementExpensesViewData", () => {
    it("returns soils distributions, decontaminated surface area and reinstatement expenses", () => {
      const viewData = selectPVReinstatementExpensesViewData(MOCK_STATE);
      expect(viewData).toEqual({
        siteSoilsDistribution: siteData.soilsDistribution,
        projectSoilsDistribution: {
          BUILDINGS: 3000,
          ARTIFICIAL_TREE_FILLED: 5000,
          FOREST_MIXED: 60000,
          MINERAL_SOIL: 5000,
          IMPERMEABLE_SOILS: 1300,
        },
        decontaminatedSurfaceArea: 1000,
        reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }],
      });
    });
  });

  describe("selectPVYearlyProjectedRevenueViewData", () => {
    it("returns initial values and photovoltaic expected annual production", () => {
      const viewData = selectPVYearlyProjectedRevenueViewData(MOCK_STATE);
      expect(viewData).toEqual({
        initialValues: expect.any(Object),
        photovoltaicExpectedAnnualProduction: 50000,
      });
    });
  });
});
