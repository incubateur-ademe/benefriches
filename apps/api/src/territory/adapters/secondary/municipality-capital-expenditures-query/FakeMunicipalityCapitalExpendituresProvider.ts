import {
  MunicipalityCapitalExpendituresProvider,
  CapitalExpendituresResult,
} from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

export class FakeMunicipalityCapitalExpendituresProvider implements MunicipalityCapitalExpendituresProvider {
  private shouldThrowError = false;

  getLastReferenceYear(): Promise<CapitalExpendituresResult> {
    if (this.shouldThrowError) {
      throw new Error();
    }
    return Promise.resolve({
      amount: 8_000_000,
      referenceYear: "2025",
    });
  }

  simulateServiceFailure(): void {
    this.shouldThrowError = true;
  }
}
