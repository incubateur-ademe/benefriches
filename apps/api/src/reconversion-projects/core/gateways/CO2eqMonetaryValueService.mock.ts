import { CO2eqMonetaryValueServiceInterface } from "src/reconversion-projects/core/gateways/CO2eqMonetaryValueService";

export class CO2eqMonetaryValueServiceMock implements CO2eqMonetaryValueServiceInterface {
  firstYear = 2025;
  durationInYears = 30;

  getCO2MonetaryValueForYear(year: number) {
    if (year === 2025) {
      return 90;
    }
    return 250;
  }

  getAnnualizedCO2MonetaryValueForDuration() {
    return 1500000;
  }
}
