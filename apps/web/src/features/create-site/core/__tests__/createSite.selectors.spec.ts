import { buildUser } from "@/features/onboarding/core/user.mock";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectAddressFormViewData,
  selectExpressResultViewData,
  selectIsSiteOperatedFormViewData,
  selectSiteSurfaceAreaFormViewData,
  selectSoilContaminationFormViewData,
  selectSpacesSelectionFormViewData,
} from "../selectors/createSite.selectors";
import {
  selectSiteOperatorFormViewData,
  selectSiteOwnerFormViewData,
  selectSiteTenantFormViewData,
} from "../selectors/viewData.selectors";
import { StoreBuilder } from "./creation-steps/testUtils";

const GRENOBLE_LOCAL_AUTHORITIES = {
  city: {
    code: "38185",
    name: "Grenoble",
  },
  epci: {
    code: "200040715",
    name: "Grenoble-Alpes-Métropole",
  },
  department: {
    code: "38",
    name: "Isère",
  },
  region: {
    code: "84",
    name: "Auvergne-Rhône-Alpes",
  },
};

const GRENOBLE_ADDRESS = {
  lat: 5.7243,
  long: 45.182081,
  city: "Grenoble",
  banId: "38185",
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

describe("createSite ViewData selectors", () => {
  describe("selectSiteOwnerFormViewData", () => {
    it("returns composed view data with current user structure, site nature, owner, and local authorities", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const state = {
        ...defaultState,
        siteCreation: {
          ...defaultState.siteCreation,
          siteData: {
            ...defaultState.siteCreation.siteData,
            nature: "FRICHE" as const,
            owner: {
              name: "Ma Société",
              structureType: "company" as const,
            },
          },
        },
        currentUser: {
          ...defaultState.currentUser,
          currentUser: {
            ...buildUser(),
            structureType: "company",
            structureName: "Ma Structure",
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: GRENOBLE_LOCAL_AUTHORITIES,
          population: 160649,
        },
      } satisfies RootState;

      const viewData = selectSiteOwnerFormViewData(state);

      expect(viewData).toEqual({
        currentUserStructure: {
          type: "company",
          name: "Ma Structure",
          activity: "photovoltaic_plants_developer",
        },
        siteNature: "FRICHE",
        owner: {
          name: "Ma Société",
          structureType: "company",
        },
        localAuthoritiesList: [
          { type: "municipality", name: "Mairie de Grenoble" },
          { type: "epci", name: "Grenoble-Alpes-Métropole" },
          { type: "department", name: "Département Isère" },
          { type: "region", name: "Région Auvergne-Rhône-Alpes" },
        ],
      });
    });
  });

  describe("selectSiteTenantFormViewData", () => {
    it("returns tenant and local authorities list without current owner", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const state = {
        ...defaultState,
        siteCreation: {
          ...defaultState.siteCreation,
          siteData: {
            ...defaultState.siteCreation.siteData,
            owner: {
              name: "Mairie de Grenoble",
              structureType: "municipality" as const,
            },
            tenant: {
              name: "ACME Corp",
              structureType: "company" as const,
            },
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: GRENOBLE_LOCAL_AUTHORITIES,
          population: 160649,
        },
      } satisfies RootState;

      const viewData = selectSiteTenantFormViewData(state);

      expect(viewData).toEqual({
        tenant: {
          name: "ACME Corp",
          structureType: "company",
        },
        localAuthoritiesList: [
          { type: "epci", name: "Grenoble-Alpes-Métropole" },
          { type: "department", name: "Département Isère" },
          { type: "region", name: "Région Auvergne-Rhône-Alpes" },
        ],
      });
    });
  });

  describe("selectIsSiteOperatedFormViewData", () => {
    it("returns is site operated status and site nature", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "AGRICULTURAL_OPERATION",
          isSiteOperated: true,
        })
        .build()
        .getState();

      const viewData = selectIsSiteOperatedFormViewData(state);

      expect(viewData).toEqual({
        isSiteOperated: true,
        siteNature: "AGRICULTURAL_OPERATION",
      });
    });
  });

  describe("selectSiteOperatorFormViewData", () => {
    it("returns site owner and local authorities list", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const state = {
        ...defaultState,
        siteCreation: {
          ...defaultState.siteCreation,
          siteData: {
            ...defaultState.siteCreation.siteData,
            owner: {
              name: "Propriétaire Agricole",
              structureType: "private_individual" as const,
            },
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: GRENOBLE_LOCAL_AUTHORITIES,
          population: 160649,
        },
      } satisfies RootState;

      const viewData = selectSiteOperatorFormViewData(state);

      expect(viewData).toEqual({
        siteOwner: {
          name: "Propriétaire Agricole",
          structureType: "private_individual",
        },
        localAuthoritiesList: [
          { type: "municipality", name: "Mairie de Grenoble" },
          { type: "epci", name: "Grenoble-Alpes-Métropole" },
          { type: "department", name: "Département Isère" },
          { type: "region", name: "Région Auvergne-Rhône-Alpes" },
        ],
      });
    });
  });

  describe("selectSiteSurfaceAreaFormViewData", () => {
    it("returns surface area and site nature", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          surfaceArea: 15000,
        })
        .build()
        .getState();

      const viewData = selectSiteSurfaceAreaFormViewData(state);

      expect(viewData).toEqual({
        siteSurfaceArea: 15000,
        siteNature: "FRICHE",
      });
    });
  });

  describe("selectSoilContaminationFormViewData", () => {
    it("returns surface area and contamination data", () => {
      const state = new StoreBuilder()
        .withCreationData({
          surfaceArea: 20000,
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 5000,
        })
        .build()
        .getState();

      const viewData = selectSoilContaminationFormViewData(state);

      expect(viewData).toEqual({
        siteSurfaceArea: 20000,
        siteContamination: {
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 5000,
        },
      });
    });
  });

  describe("selectAddressFormViewData", () => {
    it("returns site nature and address", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "NATURAL_AREA",
          address: GRENOBLE_ADDRESS,
        })
        .build()
        .getState();

      const viewData = selectAddressFormViewData(state);

      expect(viewData).toEqual({
        siteNature: "NATURAL_AREA",
        address: GRENOBLE_ADDRESS,
      });
    });
  });

  describe("selectSpacesSelectionFormViewData", () => {
    it("returns site nature and soils", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          soils: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
        })
        .build()
        .getState();

      const viewData = selectSpacesSelectionFormViewData(state);

      expect(viewData).toEqual({
        siteNature: "FRICHE",
        soils: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
      });
    });
  });

  describe("selectExpressResultViewData", () => {
    it("returns site id and save loading state", () => {
      const store = new StoreBuilder().withCreationData({}).build();
      const state = store.getState();
      const siteId = state.siteCreation.siteData.id;

      const viewData = selectExpressResultViewData(state);

      expect(viewData).toEqual({
        siteId,
        saveLoadingState: "idle",
      });
    });
  });
});
