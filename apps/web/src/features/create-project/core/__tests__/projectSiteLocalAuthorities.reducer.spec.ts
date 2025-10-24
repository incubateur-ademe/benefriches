/* eslint-disable @typescript-eslint/unbound-method */
import { Address } from "shared";

import { createStore, RootState } from "@/shared/core/store-config/store";
import { AdministrativeDivisionMock } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { fetchSiteRelatedLocalAuthorities } from "../actions/getSiteLocalAuthorities.action";
import { getInitialState as getInitialProjectCreationState } from "../createProject.reducer";
import { relatedSiteData } from "./siteData.mock";

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
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

const INITIAL_STATE = {
  ...getInitialProjectCreationState(),
  siteData: {
    ...relatedSiteData,
    address: PARIS_ADDRESS_MOCK,
  },
  siteDataLoadingState: "success",
} as const satisfies RootState["projectCreation"];

describe("Site Local Authorities reducer", () => {
  it("should return error when there is no siteData in createSite store", async () => {
    const store = createStore(
      getTestAppDependencies({
        municipalityDataService: new AdministrativeDivisionMock(API_MOCKED_RESULT["75110"]),
      }),
    );

    await store.dispatch(fetchSiteRelatedLocalAuthorities());

    const state = store.getState();
    expect(state.projectCreation.siteRelatedLocalAuthorities).toEqual({
      loadingState: "error",
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

    await store.dispatch(fetchSiteRelatedLocalAuthorities());

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

    await store.dispatch(fetchSiteRelatedLocalAuthorities());

    const state = store.getState();
    expect(state.projectCreation.siteRelatedLocalAuthorities).toEqual({
      loadingState: "success",
      ...API_MOCKED_RESULT["75110"].localAuthorities,
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

    await store.dispatch(fetchSiteRelatedLocalAuthorities());

    const state = store.getState();
    expect(state.projectCreation.siteRelatedLocalAuthorities).toEqual({
      loadingState: "success",
      ...API_MOCKED_RESULT["38185"].localAuthorities,
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

    await store.dispatch(fetchSiteRelatedLocalAuthorities());

    const state = store.getState();
    expect(state.projectCreation.siteRelatedLocalAuthorities).toEqual({
      loadingState: "error",
    });
  });
});
