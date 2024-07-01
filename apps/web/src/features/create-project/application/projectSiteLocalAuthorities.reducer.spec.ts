/* eslint-disable @typescript-eslint/unbound-method */
import { Address } from "../domain/project.types";
import { fetchSiteLocalAuthorities } from "./projectSiteLocalAuthorities.actions";
import { relatedSiteData } from "./siteData.mock";

import { createStore, RootState } from "@/app/application/store";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

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

const PARIS_ADDRESS_MOCK: Address = {
  lat: 2.347,
  long: 48.859,
  city: "Paris",
  banId: "75110_7043",
  cityCode: "75110",
  postCode: "75010",
  value: "Rue de Paradis 75010 Paris",
};

const GRENOBLE_ADDRESS_MOCK: Address = {
  lat: 5.7243,
  long: 45.182081,
  city: "Grenoble",
  banId: "38185",
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

const INITIAL_STATE = {
  siteData: {
    ...relatedSiteData,
    address: PARIS_ADDRESS_MOCK,
  },
  stepsHistory: ["PROJECT_TYPES"],
  projectData: {},
  siteDataLoadingState: "success",
  saveProjectLoadingState: "idle",
  mixedUseNeighbourhood: {
    createMode: undefined,
    stepsHistory: [],
  },
} as const satisfies RootState["projectCreation"];

describe("Site Local Authorities reducer", () => {
  it("should return error when there is no siteData in createSite store", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]),
      }),
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.projectSiteLocalAuthorities).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });

  it("should call Local Authorities Service with the right payload", async () => {
    const localAuthoritiesMockSpy = new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]);
    vi.spyOn(localAuthoritiesMockSpy, "getMunicipalityData");

    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: localAuthoritiesMockSpy,
      }),
      {
        projectCreation: INITIAL_STATE,
      },
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    expect(localAuthoritiesMockSpy.getMunicipalityData).toHaveBeenCalledTimes(1);
    expect(localAuthoritiesMockSpy.getMunicipalityData).toHaveBeenCalledWith("75110");
  });

  it("should get site local authorities with no epci for paris 10", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]),
      }),
      {
        projectCreation: INITIAL_STATE,
      },
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.projectSiteLocalAuthorities).toEqual({
      loadingState: "success",
      localAuthorities: API_MOCKED_RESULT["75110"].localAuthorities,
    });
  });

  it("should get all site local authorities for grenoble cityCode", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["38185"]),
      }),
      {
        projectCreation: {
          ...INITIAL_STATE,
          siteData: {
            ...relatedSiteData,
            address: GRENOBLE_ADDRESS_MOCK,
          },
        },
      },
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.projectSiteLocalAuthorities).toEqual({
      loadingState: "success",
      localAuthorities: API_MOCKED_RESULT["38185"].localAuthorities,
    });
  });

  it("should return error state when service fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(
          // @ts-expect-error intended failure
          null,
          true,
        ),
      }),
      {
        projectCreation: INITIAL_STATE,
      },
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.projectSiteLocalAuthorities).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });
});
