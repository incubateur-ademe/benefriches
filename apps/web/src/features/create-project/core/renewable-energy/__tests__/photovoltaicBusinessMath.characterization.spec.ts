import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { SoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { ProjectSite } from "@/features/create-project/core/project.types";
import { InMemorySitesService } from "@/features/create-project/infrastructure/sites-service/InMemorySitesService";
import { SoilsCarbonStorageMock } from "@/shared/infrastructure/soils-carbon-storage-service/soilsCarbonStorageMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { reconversionProjectCreationInitiated } from "../../actions/reconversionProjectCreationInitiated.action";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "../renewableEnergy.actions";
import {
  selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  selectPhotovoltaicPowerStationInstallationExpensesInitialValues,
  selectPhotovoltaicPowerStationYearlyExpensesInitialValues,
  selectPhotovoltaicPowerViewData,
  selectPhotovoltaicSurfaceViewData,
  selectPVYearlyProjectedRevenueViewData,
} from "../renewableEnergyProject.selectors";
import { StoreBuilder } from "./_testStoreHelpers";

/**
 * Characterization tests pinning today's exact PV business-math outputs (ticket 10b) before
 * the creation/update selector-consolidation refactor. These assert EXACT numeric outputs
 * (not `expect.any(Number)`) so a later refactor cannot silently drift the computed values.
 *
 * The related site (see `relatedSiteData` in `../../__tests__/siteData.mock.ts`) has
 * surfaceArea 30000 m2.
 */
describe("Photovoltaic business math (characterization)", () => {
  describe("selectPhotovoltaicPowerViewData", () => {
    it("recommends power from site surface area on the POWER key-parameter branch, with no power answered yet", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, surfaceArea: 30000 })
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "POWER" },
          },
        })
        .build();

      const viewData = selectPhotovoltaicPowerViewData(store.getState());

      expect(viewData).toEqual({
        initialValue: 3000,
        keyParameter: "POWER",
        recommendedPowerKWc: 3000,
        photovoltaicInstallationSurfaceArea: undefined,
        siteSurfaceArea: 30000,
      });
    });

    it("recommends power from the entered photovoltaic surface area on the SURFACE key-parameter branch", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, surfaceArea: 30000 })
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "SURFACE" },
          },
          RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
            completed: true,
            payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
          },
        })
        .build();

      const viewData = selectPhotovoltaicPowerViewData(store.getState());

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
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, surfaceArea: 30000 })
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "SURFACE" },
          },
          RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
            completed: true,
            payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
          },
        })
        .build();

      const viewData = selectPhotovoltaicSurfaceViewData(store.getState());

      expect(viewData).toEqual({
        keyParameter: "SURFACE",
        initialValue: 40000,
        siteSurfaceArea: 30000,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      });
    });

    it("recommends surface area from the entered electrical power on the POWER key-parameter branch, clamped to site surface area", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, surfaceArea: 30000 })
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "POWER" },
          },
          RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
            completed: true,
            payload: { photovoltaicInstallationElectricalPowerKWc: 2000 },
          },
        })
        .build();

      const viewData = selectPhotovoltaicSurfaceViewData(store.getState());

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
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: {
            completed: true,
            payload: {
              photovoltaicPanelsInstallationExpenses: [
                { amount: 20000, purpose: "installation_works" },
                { amount: 210000, purpose: "technical_studies" },
              ],
            },
          },
        })
        .build();

      const initialValues = selectPhotovoltaicPowerStationInstallationExpensesInitialValues(
        store.getState(),
      );

      expect(initialValues).toEqual({
        technicalStudy: 210000,
        works: 20000,
        other: 0,
      });
    });

    it("computes default amounts from electrical power when no expenses were manually entered", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
            completed: true,
            payload: { photovoltaicInstallationElectricalPowerKWc: 3000 },
          },
        })
        .build();

      const initialValues = selectPhotovoltaicPowerStationInstallationExpensesInitialValues(
        store.getState(),
      );

      expect(initialValues).toEqual({
        works: 2490000,
        technicalStudy: 120000,
        other: 255000,
      });
    });
  });

  describe("selectPhotovoltaicPowerStationYearlyExpensesInitialValues", () => {
    it("reads amounts from manually entered yearly expenses when present", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: {
            completed: true,
            payload: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
          },
        })
        .build();

      const initialValues = selectPhotovoltaicPowerStationYearlyExpensesInitialValues(
        store.getState(),
      );

      expect(initialValues).toEqual({
        rent: 12000,
        maintenance: 0,
        taxes: 0,
        other: 0,
      });
    });

    it("computes default amounts from electrical power when no expenses were manually entered", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
            completed: true,
            payload: { photovoltaicInstallationElectricalPowerKWc: 3000 },
          },
        })
        .build();

      const initialValues = selectPhotovoltaicPowerStationYearlyExpensesInitialValues(
        store.getState(),
      );

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
      const store = new StoreBuilder()
        .withSteps({
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
        })
        .build();

      const initialValues = selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues(
        store.getState(),
      );

      expect(initialValues).toEqual({
        localOrRegionalAuthority: 10000,
        publicSubsidies: 4000,
        other: 999.99,
      });
    });

    it("defaults financial assistance revenues to zero when none were entered", () => {
      const store = new StoreBuilder().build();

      const initialValues = selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues(
        store.getState(),
      );

      expect(initialValues).toEqual({
        localOrRegionalAuthority: 0,
        publicSubsidies: 0,
        other: 0,
      });
    });
  });

  describe("selectPVYearlyProjectedRevenueViewData", () => {
    it("computes the default recurring operations revenue from expected annual production when no revenue was manually entered", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
            completed: true,
            payload: { photovoltaicExpectedAnnualProduction: 12000 },
          },
        })
        .build();

      const viewData = selectPVYearlyProjectedRevenueViewData(store.getState());

      expect(viewData).toEqual({
        initialValues: {
          operations: 900000,
          other: 0,
        },
      });
    });
  });

  describe("soils carbon storage (store seam)", () => {
    const SITE_MOCKED_RESULT = {
      id: "03a53ffd-4f71-419e-8d04-041311eefa23",
      nature: "FRICHE",
      isExpressSite: false,
      owner: { name: "", structureType: "company" },
      name: "Friche industrielle",
      surfaceArea: 2900,
      hasContaminatedSoils: false,
      soilsDistribution: {},
      address: {
        lat: 48.859,
        long: 2.347,
        city: "Paris",
        banId: "75110_7043",
        cityCode: "75110",
        postCode: "75010",
        value: "Rue de Paradis 75010 Paris",
      },
    } as const satisfies ProjectSite;

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
          getSiteByIdService: new InMemorySitesService([SITE_MOCKED_RESULT]),
        }),
      );

      await store.dispatch(
        reconversionProjectCreationInitiated({ relatedSiteId: SITE_MOCKED_RESULT["id"] }),
      );
      await store.dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());

      const state = store.getState();
      expect(state.projectCreation.renewableEnergyProject.soilsCarbonStorage).toEqual({
        loadingState: "success",
        current: SOILS_CARBON_STORAGE_MOCKED_RESULT,
        projected: SOILS_CARBON_STORAGE_MOCKED_RESULT,
      });
    });
  });
});
