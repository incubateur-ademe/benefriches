import { describe, expect, it } from "vitest";

import { rootReducer } from "@/app/store/rootReducer";
import type { RootState } from "@/app/store/store";
import { createStore } from "@/app/store/store";
import { SoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  reconversionProjectUpdateInitiated,
  updateProjectFormRenewableEnergyActions,
} from "../updateProject.actions";
import {
  selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  selectPhotovoltaicPowerStationInstallationExpensesInitialValues,
  selectPhotovoltaicPowerStationYearlyExpensesInitialValues,
  selectPhotovoltaicPowerViewData,
  selectPhotovoltaicSurfaceViewData,
  selectPVYearlyProjectedRevenueViewData,
} from "../updateProject.selectors";
import { UpdateProjectView } from "../updateProject.types";

/**
 * Characterization tests pinning today's exact PV business-math outputs on the UPDATE side
 * (ticket 10b), mirroring
 * `create-project/core/renewable-energy/__tests__/photovoltaicBusinessMath.characterization.spec.ts`
 * with the SAME fixture inputs, to prove creation and update currently compute identically —
 * the fact the later selector-consolidation refactor must preserve.
 *
 * The site used below has surfaceArea 30000 m2, matching the creation-side fixture.
 */

const SITE_DATA: UpdateProjectView["siteData"] = {
  id: "site-1",
  name: "Friche test",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner" },
  hasContaminatedSoils: false,
  soilsDistribution: { IMPERMEABLE_SOILS: 5000 },
  surfaceArea: 30000,
  address: {
    banId: "addr-1",
    city: "Paris",
    cityCode: "75056",
    postCode: "75001",
    streetName: "Rue",
    streetNumber: "1",
    value: "1 Rue, 75001 Paris",
    long: 2.35,
    lat: 48.85,
  },
};

const initialRootState = rootReducer(undefined, { type: "@@INIT" });

const buildState = (steps: RenewableEnergyStepsState): RootState =>
  ({
    ...initialRootState,
    projectUpdate: {
      ...initialRootState.projectUpdate,
      siteData: SITE_DATA,
      siteDataLoadingState: "success",
      renewableEnergyProject: {
        ...initialRootState.projectUpdate.renewableEnergyProject,
        steps,
      },
    },
  }) satisfies RootState;

describe("Photovoltaic business math on update (characterization)", () => {
  describe("selectPhotovoltaicPowerViewData", () => {
    it("recommends power from site surface area on the POWER key-parameter branch, with no power answered yet", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
          completed: true,
          payload: { photovoltaicKeyParameter: "POWER" },
        },
      });

      const viewData = selectPhotovoltaicPowerViewData(state);

      expect(viewData).toEqual({
        initialValue: 3000,
        keyParameter: "POWER",
        recommendedPowerKWc: 3000,
        photovoltaicInstallationSurfaceArea: undefined,
        siteSurfaceArea: 30000,
      });
    });

    it("recommends power from the entered photovoltaic surface area on the SURFACE key-parameter branch", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
          completed: true,
          payload: { photovoltaicKeyParameter: "SURFACE" },
        },
        RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
          completed: true,
          payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        },
      });

      const viewData = selectPhotovoltaicPowerViewData(state);

      expect(viewData).toEqual({
        initialValue: 4000,
        keyParameter: "SURFACE",
        photovoltaicInstallationSurfaceArea: 40000,
        recommendedPowerKWc: 4000,
        siteSurfaceArea: 30000,
      });
    });
  });

  describe("selectPhotovoltaicSurfaceViewData", () => {
    it("passes through the entered surface area on the SURFACE key-parameter branch", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
          completed: true,
          payload: { photovoltaicKeyParameter: "SURFACE" },
        },
        RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
          completed: true,
          payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        },
      });

      const viewData = selectPhotovoltaicSurfaceViewData(state);

      expect(viewData).toEqual({
        keyParameter: "SURFACE",
        initialValue: 40000,
        siteSurfaceArea: 30000,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      });
    });

    it("recommends surface area from the entered electrical power on the POWER key-parameter branch, clamped to site surface area", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
          completed: true,
          payload: { photovoltaicKeyParameter: "POWER" },
        },
        RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
          completed: true,
          payload: { photovoltaicInstallationElectricalPowerKWc: 2000 },
        },
      });

      const viewData = selectPhotovoltaicSurfaceViewData(state);

      expect(viewData).toEqual({
        keyParameter: "POWER",
        initialValue: 20000,
        recommendedSurfaceArea: 20000,
        siteSurfaceArea: 30000,
        electricalPowerKWc: 2000,
      });
    });
  });

  describe("selectPhotovoltaicPowerStationInstallationExpensesInitialValues", () => {
    it("reads amounts from manually entered installation expenses when present", () => {
      const state = buildState({
        RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: {
          completed: true,
          payload: {
            photovoltaicPanelsInstallationExpenses: [
              { amount: 20000, purpose: "installation_works" },
              { amount: 210000, purpose: "technical_studies" },
            ],
          },
        },
      });

      const initialValues = selectPhotovoltaicPowerStationInstallationExpensesInitialValues(state);

      expect(initialValues).toEqual({
        technicalStudy: 210000,
        works: 20000,
        other: 0,
      });
    });

    it("computes default amounts from electrical power when no expenses were manually entered", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
          completed: true,
          payload: { photovoltaicInstallationElectricalPowerKWc: 3000 },
        },
      });

      const initialValues = selectPhotovoltaicPowerStationInstallationExpensesInitialValues(state);

      expect(initialValues).toEqual({
        works: 2490000,
        technicalStudy: 120000,
        other: 255000,
      });
    });
  });

  describe("selectPhotovoltaicPowerStationYearlyExpensesInitialValues", () => {
    it("reads amounts from manually entered yearly expenses when present", () => {
      const state = buildState({
        RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: {
          completed: true,
          payload: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
        },
      });

      const initialValues = selectPhotovoltaicPowerStationYearlyExpensesInitialValues(state);

      expect(initialValues).toEqual({
        rent: 12000,
        maintenance: 0,
        taxes: 0,
        other: 0,
      });
    });

    it("computes default amounts from electrical power when no expenses were manually entered", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
          completed: true,
          payload: { photovoltaicInstallationElectricalPowerKWc: 3000 },
        },
      });

      const initialValues = selectPhotovoltaicPowerStationYearlyExpensesInitialValues(state);

      expect(initialValues).toEqual({
        rent: 21000,
        maintenance: 54000,
        taxes: 10626,
        other: 0,
      });
    });
  });

  describe("selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues", () => {
    it("reads amounts from manually entered financial assistance revenues when present", () => {
      const state = buildState({
        RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: {
          completed: true,
          payload: {
            financialAssistanceRevenues: [
              { source: "local_or_regional_authority_participation", amount: 10000 },
              { source: "public_subsidies", amount: 4000 },
              { source: "other", amount: 999.99 },
            ],
          },
        },
      });

      const initialValues =
        selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues(state);

      expect(initialValues).toEqual({
        localOrRegionalAuthority: 10000,
        publicSubsidies: 4000,
        other: 999.99,
      });
    });

    it("defaults financial assistance revenues to zero when none were entered", () => {
      const state = buildState({});

      const initialValues =
        selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues(state);

      expect(initialValues).toEqual({
        localOrRegionalAuthority: 0,
        publicSubsidies: 0,
        other: 0,
      });
    });
  });

  describe("selectPVYearlyProjectedRevenueViewData", () => {
    it("computes the default recurring operations revenue from expected annual production when no revenue was manually entered", () => {
      const state = buildState({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
          completed: true,
          payload: { photovoltaicExpectedAnnualProduction: 12000 },
        },
      });

      const viewData = selectPVYearlyProjectedRevenueViewData(state);

      expect(viewData).toEqual({
        initialValues: {
          operations: 900000,
          other: 0,
        },
      });
    });
  });

  describe("soils carbon storage (store seam)", () => {
    const PROJECT_DATA: UpdateProjectView["projectData"] = {
      id: "project-1",
      createdBy: "user-1",
      createdAt: "2026-01-01",
      creationMode: "custom",
      name: "Centrale de test",
      relatedSiteId: "site-1",
      involvesReinstatement: false,
      projectPhase: "planning",
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: { name: "Dev Corp", structureType: "company" },
        costs: [{ purpose: "installation_works", amount: 100000 }],
        features: {
          surfaceArea: 5000,
          electricalPowerKWc: 800,
          expectedAnnualProduction: 900,
          contractDuration: 30,
        },
      },
      soilsDistribution: [{ soilType: "IMPERMEABLE_SOILS", surfaceArea: 5000 }],
      yearlyProjectedCosts: [{ purpose: "maintenance", amount: 1000 }],
      yearlyProjectedRevenues: [{ source: "operations", amount: 50000 }],
      futureOperator: { name: "Operator Corp", structureType: "company" },
    };

    const SOILS_CARBON_STORAGE_MOCKED_RESULT: SoilsCarbonStorageResult = {
      totalCarbonStorage: 1234,
      soilsStorage: [
        {
          type: "PRAIRIE_TREES",
          surfaceArea: 5000,
          carbonStorage: 1234,
          carbonStorageInTonPerSquareMeters: 0.2468,
        },
      ],
    };

    it("stores the current and projected carbon storage results returned by the service", async () => {
      const store = createStore(
        getTestAppDependencies({
          soilsCarbonStorageService: new SoilsCarbonStorageMock(SOILS_CARBON_STORAGE_MOCKED_RESULT),
        }),
      );

      store.dispatch(
        reconversionProjectUpdateInitiated.fulfilled(
          { projectData: PROJECT_DATA, siteData: SITE_DATA },
          "request-1",
          "project-1",
        ),
      );
      await store.dispatch(
        updateProjectFormRenewableEnergyActions.fetchCurrentAndProjectedSoilsCarbonStorage(),
      );

      const state = store.getState();
      expect(state.projectUpdate.renewableEnergyProject.soilsCarbonStorage).toEqual({
        loadingState: "success",
        current: SOILS_CARBON_STORAGE_MOCKED_RESULT,
        projected: SOILS_CARBON_STORAGE_MOCKED_RESULT,
      });
    });
  });
});
