import { GetMunicipalityDataResult } from "@/features/create-site/core/actions/siteMunicipalityData.actions";

export class AdministrativeDivisionMock {
  private result: GetMunicipalityDataResult;
  private shouldFail: boolean;

  constructor(result: GetMunicipalityDataResult, shouldFail: boolean = false) {
    this.result = result;
    this.shouldFail = shouldFail;
  }

  async getMunicipalityData() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
