import {
  AdministrativeDivisionGateway,
  GetMunicipalityDataResult,
} from "@/shared/core/gateways/AdministrativeDivisionGateway";

export class AdministrativeDivisionMock implements AdministrativeDivisionGateway {
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
