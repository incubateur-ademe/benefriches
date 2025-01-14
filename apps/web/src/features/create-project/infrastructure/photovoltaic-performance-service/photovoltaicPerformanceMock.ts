import {
  PhotovoltaicPerformanceApiResult,
  PhotovoltaicPerformanceGateway,
} from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";

export const MOCK_RESULT = {
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
};

export class ExpectedPhotovoltaicPerformanceMock implements PhotovoltaicPerformanceGateway {
  constructor(
    private result: PhotovoltaicPerformanceApiResult,
    private shouldFail: boolean = false,
  ) {}

  async getExpectedPhotovoltaicPerformance() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
