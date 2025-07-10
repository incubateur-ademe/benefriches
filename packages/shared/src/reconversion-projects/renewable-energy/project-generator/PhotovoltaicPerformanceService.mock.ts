export class MockPhotovoltaicPerformanceService {
  private _shouldFail = false;

  shouldFail() {
    this._shouldFail = true;
  }

  getPhotovoltaicPerformance() {
    if (this._shouldFail) throw new Error("Intended error");

    return Promise.resolve({
      expectedPerformance: {
        kwhPerDay: 6173.43,
        kwhPerMonth: 187786.91,
        kwhPerYear: 2253442.92,
      },
    });
  }
}
