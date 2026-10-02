import {
  MunicipalityCapitalExpendituresProvider,
  CapitalExpendituresResult,
} from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

export class FakeMunicipalityCapitalExpendituresProvider implements MunicipalityCapitalExpendituresProvider {
  getLastReferenceYear(): Promise<CapitalExpendituresResult> {
    return Promise.resolve({
      amount: 8_000_000,
      referenceYear: "2025",
    });
  }
}
