/* eslint-disable @typescript-eslint/unbound-method */
import { ProjectSite } from "@/features/create-project/core/project.types";
import { ExpectedPhotovoltaicPerformanceMock } from "@/features/create-project/infrastructure/photovoltaic-performance-service/photovoltaicPerformanceMock";
import { SitesServiceMock } from "@/features/create-project/infrastructure/sites-service/SitesServiceMock";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { reconversionProjectCreationInitiated } from "../../actions/reconversionProjectCreationInitiated.action";
import {
  fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation,
  PhotovoltaicPerformanceApiResult,
} from "../actions/getPhotovoltaicExpectedPerformance.action";
import { completePhotovoltaicInstallationElectricalPower } from "../actions/renewableEnergy.actions";

const API_MOCKED_RESULT = {
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
} as const satisfies PhotovoltaicPerformanceApiResult;

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

describe("Photovoltaic expected performance reducer", () => {
  it("should return error when there is no projectData in createProject store", async () => {
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: new ExpectedPhotovoltaicPerformanceMock(API_MOCKED_RESULT),
      }),
    );

    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance).toEqual({
      loadingState: "error",
      expectedPerformanceMwhPerYear: undefined,
    });
  });

  it("should call ExpectedPhotovoltaicPerformanceMock with the right payload", async () => {
    const mockSpy = new ExpectedPhotovoltaicPerformanceMock(API_MOCKED_RESULT);
    vi.spyOn(mockSpy, "getExpectedPhotovoltaicPerformance");
    const store = createStore(
      getTestAppDependencies({
        photovoltaicPerformanceService: mockSpy,
        getSiteByIdService: new SitesServiceMock(SITE_MOCKED_RESULT),
      }),
    );

    await store.dispatch(
      reconversionProjectCreationInitiated({ relatedSiteId: SITE_MOCKED_RESULT["id"] }),
    );
    store.dispatch(completePhotovoltaicInstallationElectricalPower(3));
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

    await store.dispatch(
      reconversionProjectCreationInitiated({ relatedSiteId: SITE_MOCKED_RESULT["id"] }),
    );
    store.dispatch(completePhotovoltaicInstallationElectricalPower(3.0));
    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance).toEqual({
      loadingState: "success",
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

    await store.dispatch(
      reconversionProjectCreationInitiated({ relatedSiteId: SITE_MOCKED_RESULT["id"] }),
    );
    store.dispatch(completePhotovoltaicInstallationElectricalPower(3.0));
    await store.dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());

    const state = store.getState();
    expect(state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance).toEqual({
      loadingState: "error",
      expectedPerformanceMwhPerYear: undefined,
    });
  });
});
