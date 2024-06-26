import { CO2eqMonetaryValueServiceInterface } from "src/reconversion-projects/core/gateways/CO2eqMonetaryValueService";

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

const CO2_EQ_MONETARY_VALUE_EURO_2020 = 90;
const CO2_EQ_MONETARY_VALUE_EURO_2030 = 250;

export class CO2eqMonetaryValueService implements CO2eqMonetaryValueServiceInterface {
  getCO2MonetaryValueForYear(year: number) {
    const ratioKnownPeriods = Math.pow(
      CO2_EQ_MONETARY_VALUE_EURO_2030 / CO2_EQ_MONETARY_VALUE_EURO_2020,
      1 / (2030 - 2020),
    );

    return roundTo2Digits(
      CO2_EQ_MONETARY_VALUE_EURO_2020 * Math.pow(1 + ratioKnownPeriods - 1, year - 2020),
    );
  }

  getAnnualizedCO2MonetaryValueForDuration(
    yearlyCo2Tons: number,
    firstYear: number,
    durationInYears: number,
  ) {
    return roundTo2Digits(
      Array(durationInYears)
        .fill(0)
        .map((_, index) => yearlyCo2Tons * this.getCO2MonetaryValueForYear(firstYear + index))
        .reduce((sum, item) => sum + item, 0),
    );
  }
}
