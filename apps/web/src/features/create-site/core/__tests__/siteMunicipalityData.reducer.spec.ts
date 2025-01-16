/* eslint-disable @typescript-eslint/unbound-method */
import { createStore, RootState } from "@/app/application/store";
import { buildUser } from "@/features/onboarding/core/user.mock";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { fetchSiteMunicipalityData } from "../actions/siteMunicipalityData.actions";
import {
  selectAvailableLocalAuthorities,
  selectAvailableLocalAuthoritiesWithoutCurrentOwner,
  selectAvailableLocalAuthoritiesWithoutCurrentUser,
} from "../siteMunicipalityData.reducer";

const API_MOCKED_RESULT = {
  "75110": {
    localAuthorities: {
      city: {
        name: "Paris 10e Arrondissement",
        code: "75110",
      },
      department: {
        code: "75",
        name: "Paris",
      },
      region: {
        code: "11",
        name: "Île-de-France",
      },
    },
    population: 83459,
  },
  "38185": {
    localAuthorities: {
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
    },
    population: 160649,
  },
};

const PARIS_ADDRESS_MOCK = {
  lat: 2.347,
  long: 48.859,
  city: "Paris",
  banId: "75110_7043",
  cityCode: "75110",
  postCode: "75010",
  value: "Rue de Paradis 75010 Paris",
};

const GRENOBLE_ADDRESS_MOCK = {
  lat: 5.7243,
  long: 45.182081,
  city: "Grenoble",
  banId: "38185",
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

describe("Site Municipality data reducer", () => {
  it("should return error when there is no siteData in createSite store", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]),
      }),
    );

    await store.dispatch(fetchSiteMunicipalityData());

    const state = store.getState();
    expect(state.siteMunicipalityData).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });

  it("should call Municipality data service with the right payload", async () => {
    const mockSpy = new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]);
    vi.spyOn(mockSpy, "getMunicipalityData");

    const initialState: RootState["siteCreation"] = {
      siteData: {
        address: PARIS_ADDRESS_MOCK,
      },
      saveLoadingState: "idle",
      stepsHistory: ["OWNER"],
    };

    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: mockSpy,
      }),
      {
        siteCreation: initialState,
      },
    );

    await store.dispatch(fetchSiteMunicipalityData());

    expect(mockSpy.getMunicipalityData).toHaveBeenCalledTimes(1);
    expect(mockSpy.getMunicipalityData).toHaveBeenCalledWith("75110");
  });

  it("should get site local authorities with no epci for paris 10", async () => {
    const initialState: RootState["siteCreation"] = {
      siteData: {
        address: PARIS_ADDRESS_MOCK,
      },
      saveLoadingState: "idle",
      stepsHistory: ["OWNER"],
    };

    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]),
      }),
      {
        siteCreation: initialState,
      },
    );

    await store.dispatch(fetchSiteMunicipalityData());

    const state = store.getState();
    expect(state.siteMunicipalityData).toEqual({
      loadingState: "success",
      ...API_MOCKED_RESULT["75110"],
    });
  });

  it("should get all site local authorities for grenoble cityCode", async () => {
    const initialState: RootState["siteCreation"] = {
      siteData: {
        address: GRENOBLE_ADDRESS_MOCK,
      },
      saveLoadingState: "idle",
      stepsHistory: ["OWNER"],
    };

    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["38185"]),
      }),
      {
        siteCreation: initialState,
      },
    );

    await store.dispatch(fetchSiteMunicipalityData());

    const state = store.getState();
    expect(state.siteMunicipalityData).toEqual({
      loadingState: "success",
      localAuthorities: API_MOCKED_RESULT["38185"].localAuthorities,
      population: API_MOCKED_RESULT["38185"].population,
    });
  });

  it("should return error state when service fails", async () => {
    const initialState: RootState["siteCreation"] = {
      siteData: {
        address: GRENOBLE_ADDRESS_MOCK,
      },
      saveLoadingState: "idle",
      stepsHistory: ["OWNER"],
    };

    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(
          // @ts-expect-error intended failure
          null,
          true,
        ),
      }),
      {
        siteCreation: initialState,
      },
    );

    await store.dispatch(fetchSiteMunicipalityData());

    const state = store.getState();
    expect(state.siteMunicipalityData).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });
});

describe("Site public authorities selectors", () => {
  describe("selectAvailableLocalAuthorities", () => {
    it("should get all public authorities options related to municipality from store", () => {
      const state = {
        ...createStore(getTestAppDependencies()).getState(),
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: API_MOCKED_RESULT["75110"].localAuthorities,
          population: 83459,
        },
      } satisfies RootState;

      const result = selectAvailableLocalAuthorities(state);

      expect(result).toEqual([
        {
          type: "municipality",
          name: "Mairie de Paris 10e Arrondissement",
        },
        {
          type: "epci",
          name: "Établissement public de coopération intercommunale",
        },
        {
          type: "department",
          name: "Département Paris",
        },
        {
          type: "region",
          name: "Région Île-de-France",
        },
      ]);
    });

    it("should get default public authorities options related to municipality when no data in store", () => {
      const state = createStore(getTestAppDependencies()).getState();

      const result = selectAvailableLocalAuthorities(state);

      expect(result).toEqual([
        {
          type: "municipality",
          name: "Mairie",
        },
        {
          type: "epci",
          name: "Établissement public de coopération intercommunale",
        },
        {
          type: "department",
          name: "Département",
        },
        {
          type: "region",
          name: "Région",
        },
      ]);
    });
  });

  describe("selectAvailableLocalAuthoritiesWithoutCurrentOwner", () => {
    it("should exclude site owner from available local authorities", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const grenobleLocalAuthorities = API_MOCKED_RESULT["38185"].localAuthorities;

      const state = {
        ...defaultState,
        siteCreation: {
          ...defaultState.siteCreation,
          siteData: {
            ...defaultState.siteCreation.siteData,
            owner: {
              name: grenobleLocalAuthorities.epci.name,
              structureType: "epci",
            },
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: grenobleLocalAuthorities,
          population: 83459,
        },
      } satisfies RootState;
      const result = selectAvailableLocalAuthoritiesWithoutCurrentOwner(state);

      expect(result).toEqual([
        {
          type: "municipality",
          name: "Mairie de Grenoble",
        },
        {
          type: "department",
          name: "Département Isère",
        },
        {
          type: "region",
          name: "Région Auvergne-Rhône-Alpes",
        },
      ]);
    });
    it("should return all available local authorities when no site owner in store", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const grenobleLocalAuthorities = API_MOCKED_RESULT["38185"].localAuthorities;

      const state = {
        ...defaultState,
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: grenobleLocalAuthorities,
          population: 83459,
        },
      } satisfies RootState;
      const result = selectAvailableLocalAuthoritiesWithoutCurrentOwner(state);

      expect(result).toEqual([
        {
          type: "municipality",
          name: "Mairie de Grenoble",
        },
        {
          type: "epci",
          name: "Grenoble-Alpes-Métropole",
        },
        {
          type: "department",
          name: "Département Isère",
        },
        {
          type: "region",
          name: "Région Auvergne-Rhône-Alpes",
        },
      ]);
    });
  });

  describe("selectAvailableLocalAuthoritiesWithoutCurrentUser", () => {
    it("should exclude user structure from available options", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const grenobleLocalAuthorities = API_MOCKED_RESULT["38185"].localAuthorities;

      const state = {
        ...defaultState,
        currentUser: {
          ...defaultState.currentUser,
          currentUser: {
            ...buildUser(),
            structureType: "local_authority",
            structureActivity: "municipality",
            structureName: "Mairie de Grenoble",
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: grenobleLocalAuthorities,
          population: 83459,
        },
      } satisfies RootState;
      const result = selectAvailableLocalAuthoritiesWithoutCurrentUser(state);

      expect(result).toEqual([
        {
          type: "epci",
          name: "Grenoble-Alpes-Métropole",
        },
        {
          type: "department",
          name: "Département Isère",
        },
        {
          type: "region",
          name: "Région Auvergne-Rhône-Alpes",
        },
      ]);
    });
    it("should not exclude user structure when not part of available options", () => {
      const defaultState = createStore(getTestAppDependencies()).getState();
      const grenobleLocalAuthorities = API_MOCKED_RESULT["38185"].localAuthorities;

      const state = {
        ...defaultState,
        currentUser: {
          ...defaultState.currentUser,
          currentUser: {
            ...buildUser(),
            structureType: "local_authority",
            structureActivity: "municipality",
            structureName: "Mairie de Marseille",
          },
        },
        siteMunicipalityData: {
          loadingState: "success",
          localAuthorities: grenobleLocalAuthorities,
          population: 83459,
        },
      } satisfies RootState;
      const result = selectAvailableLocalAuthoritiesWithoutCurrentUser(state);

      expect(result).toEqual([
        {
          type: "municipality",
          name: "Mairie de Grenoble",
        },
        {
          type: "epci",
          name: "Grenoble-Alpes-Métropole",
        },
        {
          type: "department",
          name: "Département Isère",
        },
        {
          type: "region",
          name: "Région Auvergne-Rhône-Alpes",
        },
      ]);
    });
  });
});
