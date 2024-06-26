export interface CO2eqMonetaryValueServiceInterface {
  getAnnualizedCO2MonetaryValueForDuration: (
    yearlyCo2Value: number,
    firstYear: number,
    durationInYears: number,
  ) => number;
  getCO2MonetaryValueForYear: (year: number) => number;
}
