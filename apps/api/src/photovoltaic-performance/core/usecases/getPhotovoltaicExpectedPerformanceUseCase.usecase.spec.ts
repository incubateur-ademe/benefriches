import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { FakePhotovoltaicDataProvider } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/FakePhotovoltaicDataProvider";
import type { SuccessResult } from "src/shared-kernel/result";

import { GetPhotovoltaicExpectedPerformanceUseCase } from "./getPhotovoltaicExpectedPerformanceUseCase";

describe("GetPhotovoltaicExpectedPerformanceUseCase use case", () => {
  let dataProvider: FakePhotovoltaicDataProvider;

  beforeEach(() => {
    dataProvider = new FakePhotovoltaicDataProvider();
  });

  it("it should format the service result", async () => {
    const usecase = new GetPhotovoltaicExpectedPerformanceUseCase(dataProvider);
    const result = await usecase.execute({ lat: 48.859, long: 2.347, peakPower: 3.1 });

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult;
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const data = successResult.getData();
    assert.deepStrictEqual(data, {
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
    });
  });
});
