/* eslint-disable @typescript-eslint/unbound-method */
import { ProjectSite } from "../domain/project.types";
import { ExpectedPhotovoltaicPerformanceMock } from "../infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { SitesServiceMock } from "../infrastructure/sites-service/SitesServiceMock";
import { fetchRelatedSiteAction } from "./createProject.actions";
import { setPhotovoltaicInstallationElectricalPower } from "./createProject.reducer";
import {
  fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation,
  PhotovoltaicPerformanceApiResult,
} from "./pvExpectedPerformanceStorage.actions";

import { createStore } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

const API_MOCKED_RESULT = {
  computationContext: {
    location: { lat: 48.859, long: 2.347, elevation: 49 },
    dataSources: {
      radiation: "PVGIS-SARAH2",
      meteo: "ERA5",
      period: "2005 - 2020",
      horizon: "DEM-calculated",
    },
    pvInstallation: {
      technology: "c-Si",
      peakPower: 3,
      systemLoss: 14,
      slope: { value: 35, optimal: false },
      azimuth: { value: 0, optimal: false },
      type: "free-standing",
    },
  },
  expectedPerformance: {
    kwhPerDay: 9.43,
    kwhPerMonth: 286.91,
    kwhPerYear: 3442.92,
    lossPercents: {
      angleIncidence: -2.98,
      spectralIncidence: 1.65,
      tempAndIrradiance: -5.73,
      total: -20.05,
    },
  },
} as PhotovoltaicPerformanceApiResult;

const SITE_MOCKED_RESULT = {
  id: "03a53ffd-4f71-419e-8d04-041311eefa23",
  isFriche: true,
  owner: { name: "", structureType: "company" },
  name: "Friche industrielle",
  surfaceArea: 2900,
  hasContaminatedSoils: false,
  address: {
    lat: 48.859,
    long: 2.347,
    city: "Paris",
    id: "75110_7043",
    cityCode: "75110",
    postCode: "75010",
    value: "Rue de Paradis 75010 Paris",
  },
} as ProjectSite;

describe("Photovoltaic expected performance reducer", () => {
  it("should return error when there is no projectData in createProject store", async () => {
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(API_MOCKED_RESULT),
      }),
    );

    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectPvExpectedPerformancesStorage).toEqual({
      loadingState: "error",
      computationContext: undefined,
      expectedPerformanceMwhPerYear: undefined,
    });
  });

  it("should call ExpectedPhotovoltaicPerformanceMock with the right payload", async () => {
    const mockSpy = new ExpectedPhotovoltaicPerformanceMock(API_MOCKED_RESULT);
    jest.spyOn(mockSpy, "getExpectedPhotovoltaicPerformance");
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: mockSpy,
        getSiteByIdService: new SitesServiceMock(SITE_MOCKED_RESULT),
      }),
    );

    await store.dispatch(fetchRelatedSiteAction(SITE_MOCKED_RESULT["id"]));
    store.dispatch(setPhotovoltaicInstallationElectricalPower(3));
    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    expect(mockSpy.getExpectedPhotovoltaicPerformance).toHaveBeenCalledTimes(1);
    expect(mockSpy.getExpectedPhotovoltaicPerformance).toHaveBeenCalledWith({
      long: 2.347,
      lat: 48.859,
      peakPower: 3,
    });
  });

  it("should get expected performance power for site geo coordinates and installation power", async () => {
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(API_MOCKED_RESULT),
        getSiteByIdService: new SitesServiceMock(SITE_MOCKED_RESULT),
      }),
    );

    await store.dispatch(fetchRelatedSiteAction(SITE_MOCKED_RESULT["id"]));
    store.dispatch(setPhotovoltaicInstallationElectricalPower(3.0));
    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectPvExpectedPerformancesStorage).toEqual({
      loadingState: "success",
      computationContext: API_MOCKED_RESULT.computationContext,
      expectedPerformanceMwhPerYear: 3,
    });
  });

  it("should return error state when service fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(
          // @ts-expect-error intended failure
          null,
          true,
        ),
      }),
    );

    await store.dispatch(fetchRelatedSiteAction(SITE_MOCKED_RESULT["id"]));
    store.dispatch(setPhotovoltaicInstallationElectricalPower(3.0));
    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectPvExpectedPerformancesStorage).toEqual({
      loadingState: "error",
      expectedPerformanceMwhPerYear: undefined,
      computationContext: undefined,
    });
  });
});
