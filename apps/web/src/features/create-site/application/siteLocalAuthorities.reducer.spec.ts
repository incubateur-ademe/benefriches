/* eslint-disable @typescript-eslint/unbound-method */
import { setAddress } from "./createSite.reducer";
import { fetchSiteLocalAuthorities } from "./siteLocalAuthorities.actions";

import { createStore } from "@/app/application/store";
import { LocalAuthoritiesMock } from "@/shared/infrastructure/local-authorities-service/localAuthoritiesMock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

const API_MOCKED_RESULT = {
  "75110": {
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
  "38185": {
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
};

const PARIS_ADDRESS_MOCK = {
  lat: 2.347,
  long: 48.859,
  city: "Paris",
  id: "75110_7043",
  cityCode: "75110",
  postCode: "75010",
  value: "Rue de Paradis 75010 Paris",
};

const GRENOBLE_ADDRESS_MOCK = {
  lat: 5.7243,
  long: 45.182081,
  city: "Grenoble",
  id: "38185",
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

describe("Site Local authorities reducer", () => {
  it("should return error when there is no siteData in createSite store", async () => {
    const store = createStore(
      getTestAppDependencies({
        localAuthoritiesService: new LocalAuthoritiesMock(API_MOCKED_RESULT["75110"]),
      }),
    );

    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.siteLocalAuthorities).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });

  it("should call Local Authorities service with the right payload", async () => {
    const localAuthoritiesMockSpy = new LocalAuthoritiesMock(API_MOCKED_RESULT["75110"]);
    jest.spyOn(localAuthoritiesMockSpy, "getLocalAuthoritiesForCityCode");
    const store = createStore(
      getTestAppDependencies({
        localAuthoritiesService: localAuthoritiesMockSpy,
      }),
    );

    store.dispatch(setAddress(PARIS_ADDRESS_MOCK));
    await store.dispatch(fetchSiteLocalAuthorities());

    expect(localAuthoritiesMockSpy.getLocalAuthoritiesForCityCode).toHaveBeenCalledTimes(1);
    expect(localAuthoritiesMockSpy.getLocalAuthoritiesForCityCode).toHaveBeenCalledWith("75110");
  });

  it("should get site local authorities with no epci for paris 10", async () => {
    const store = createStore(
      getTestAppDependencies({
        localAuthoritiesService: new LocalAuthoritiesMock(API_MOCKED_RESULT["75110"]),
      }),
    );

    store.dispatch(setAddress(PARIS_ADDRESS_MOCK));
    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.siteLocalAuthorities).toEqual({
      loadingState: "success",
      localAuthorities: API_MOCKED_RESULT["75110"],
    });
  });

  it("should get all site local authorities for grenoble cityCode", async () => {
    const store = createStore(
      getTestAppDependencies({
        localAuthoritiesService: new LocalAuthoritiesMock(API_MOCKED_RESULT["38185"]),
      }),
    );

    store.dispatch(setAddress(GRENOBLE_ADDRESS_MOCK));
    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.siteLocalAuthorities).toEqual({
      loadingState: "success",
      localAuthorities: API_MOCKED_RESULT["38185"],
    });
  });

  it("should return error state when service fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        localAuthoritiesService: new LocalAuthoritiesMock(
          // @ts-expect-error intended failure
          null,
          true,
        ),
      }),
    );

    store.dispatch(setAddress(GRENOBLE_ADDRESS_MOCK));
    await store.dispatch(fetchSiteLocalAuthorities());

    const state = store.getState();
    expect(state.siteLocalAuthorities).toEqual({
      loadingState: "error",
      localAuthorities: undefined,
    });
  });
});
