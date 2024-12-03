import { roundTo2Digits } from "../services";

const CO2_EQ_MONETARY_VALUE_EURO_2020 = 90;
const CO2_EQ_MONETARY_VALUE_EURO_2030 = 250;

export const getCO2MonetaryValueForYear = (year: number) => {
  const ratioKnownPeriods = Math.pow(
    CO2_EQ_MONETARY_VALUE_EURO_2030 / CO2_EQ_MONETARY_VALUE_EURO_2020,
    1 / (2030 - 2020),
  );

  return roundTo2Digits(
    CO2_EQ_MONETARY_VALUE_EURO_2020 * Math.pow(1 + ratioKnownPeriods - 1, year - 2020),
  );
};

export const getAnnualizedCO2MonetaryValueForDuration = (
  yearlyCo2Tons: number,
  firstYear: number,
  durationInYears: number,
) => {
  return roundTo2Digits(
    Array(durationInYears)
      .fill(0)
      .map((_, index) => yearlyCo2Tons * getCO2MonetaryValueForYear(firstYear + index))
      .reduce((sum, item) => sum + item, 0),
  );
};
