import { createStore, RootState } from "@/app/store/store";
import { buildUser } from "@/features/onboarding/core/user.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectExpressAddressFormViewData,
  selectSiteCreationWizardViewData,
  selectSiteSoilsDistribution,
} from "../selectors/createSite.selectors";
import { selectAddressFormViewData } from "../steps/address/address.selectors";
import { selectSoilContaminationFormViewData } from "../steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import { selectExpressResultViewData } from "../steps/final/final.selectors";
import {
  selectIsSiteOperatedFormViewData,
  selectSiteOperatorFormViewData,
  selectSiteOwnerFormViewData,
  selectSiteTenantFormViewData,
} from "../steps/site-management/siteManagement.selectors";
import {
  selectSiteSurfaceAreaFormViewData,
  selectSpacesSelectionFormViewData,
} from "../steps/spaces/spaces.selectors";
import { StoreBuilder as UrbanZoneStoreBuilder } from "../urban-zone/__tests__/_testStoreHelpers";
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

  describe("selectExpressAddressFormViewData", () => {
    it("returns address and siteNature from state", () => {
      const state = new StoreBuilder()
        .withCreationData({
          address: GRENOBLE_ADDRESS,
          nature: "FRICHE",
        })
        .build()
        .getState();

      const viewData = selectExpressAddressFormViewData(state);

      expect(viewData).toEqual({
        address: GRENOBLE_ADDRESS,
        siteNature: "FRICHE",
      });
    });

    it("returns undefined address and siteNature when not yet set", () => {
      const state = createStore(getTestAppDependencies()).getState();

      const viewData = selectExpressAddressFormViewData(state);

      expect(viewData).toEqual({
        address: undefined,
        siteNature: undefined,
      });
    });
  });

  describe("selectSiteSoilsDistribution", () => {
    it("returns siteData.soilsDistribution for non-urban-zone sites", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          soilsDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 1000 },
        })
        .build()
        .getState();

      expect(selectSiteSoilsDistribution(state)).toEqual({
        BUILDINGS: 3000,
        IMPERMEABLE_SOILS: 1000,
      });
    });

    it("aggregates soils from all parcel steps for urban zone", () => {
      const state = new UrbanZoneStoreBuilder()
        .withSiteData({ nature: "URBAN_ZONE" })
        .withUrbanZoneSteps({
          URBAN_ZONE_LAND_PARCELS_SELECTION: {
            completed: true,
            payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
          },
          URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
            completed: true,
            payload: { soilsDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 1000 } },
          },
          URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
            completed: true,
            payload: { soilsDistribution: { MINERAL_SOIL: 500, IMPERMEABLE_SOILS: 500 } },
          },
        })
        .build()
        .getState();

      expect(selectSiteSoilsDistribution(state)).toEqual({
        BUILDINGS: 2000,
        IMPERMEABLE_SOILS: 1500,
        MINERAL_SOIL: 500,
      });
    });

    it("returns empty object when no parcel steps completed for urban zone", () => {
      const state = new UrbanZoneStoreBuilder()
        .withSiteData({ nature: "URBAN_ZONE" })
        .build()
        .getState();

      expect(selectSiteSoilsDistribution(state)).toEqual({});
    });
  });

  describe("selectSiteCreationWizardViewData", () => {
    it("returns current step, isFriche and createMode from state", () => {
      const state = new StoreBuilder()
        .withCreationData({ isFriche: true })
        .withCreateMode("custom")
        .build()
        .getState();

      const viewData = selectSiteCreationWizardViewData(state);

      expect(viewData).toEqual({
        currentStep: expect.any(String),
        isFriche: true,
        createMode: "custom",
      });
    });

    it("returns undefined createMode and isFriche by default", () => {
      const state = createStore(getTestAppDependencies()).getState();

      const viewData = selectSiteCreationWizardViewData(state);

      expect(viewData).toEqual({
        currentStep: expect.any(String),
        isFriche: undefined,
        createMode: undefined,
      });
    });
  });
});
