import { GetMunicipalityDataResult } from "@/features/create-site/application/siteMunicipalityData.actions";

export class AdministrativeDivisionMock {
  constructor(
    private result: GetMunicipalityDataResult,
    private shouldFail: boolean = false,
  ) {}

  async getMunicipalityData() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
