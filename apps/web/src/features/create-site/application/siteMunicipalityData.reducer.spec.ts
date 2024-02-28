/* eslint-disable @typescript-eslint/unbound-method */
import { fetchSiteMunicipalityData } from "./siteMunicipalityData.actions";

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
    jest.spyOn(mockSpy, "getMunicipalityData");

    const initialState: RootState["siteCreation"] = {
      siteData: {
        address: PARIS_ADDRESS_MOCK,
      },
      saveLoadingState: "idle",
      step: "OWNER",
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
      step: "OWNER",
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
      step: "OWNER",
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
      step: "OWNER",
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
