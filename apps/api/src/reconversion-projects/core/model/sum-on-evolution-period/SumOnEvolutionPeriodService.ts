import { roundTo2Digits, roundToInteger, sumList } from "shared";

type SumOnEvolutionPeriodServiceProps = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};

type Co2EqMonetaryYearValue = keyof typeof CO2_EQ_MONETARY_VALUE_EURO;
const CO2_EQ_MONETARY_VALUE_EURO = {
  2020: 90,
  2030: 250,
  2040: 500,
  2050: 775,
};

type Co2EqEmittedPerVehiculeKilometerYearValue = keyof typeof CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER;
const CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER = {
  2015: 157.2,
  2030: 120.9,
  2050: 87.2,
};

export class SumOnEvolutionPeriodService {
  readonly evaluationPeriodInYears: number;
  readonly operationsFirstYear: number;

  constructor(props: SumOnEvolutionPeriodServiceProps) {
    this.evaluationPeriodInYears = props.evaluationPeriodInYears;
    this.operationsFirstYear = props.operationsFirstYear;
  }

  static getYearGrossDomesticProductPerCapitaEvolution(year: number) {
    return Math.pow(1.012, year - 2022);
  }

  static getYearCO2MonetaryValue(year: number) {
    if (year >= 2050) {
      return CO2_EQ_MONETARY_VALUE_EURO[2050];
    }

    if (year === 2020 || year === 2030 || year === 2040) {
      return CO2_EQ_MONETARY_VALUE_EURO[year];
    }

    const [interpolationYear1, interpolationYear2]: [
      Co2EqMonetaryYearValue,
      Co2EqMonetaryYearValue,
    ] = year < 2030 ? [2020, 2030] : year < 2040 ? [2030, 2040] : [2040, 2050];

    const interpolationValue1 = CO2_EQ_MONETARY_VALUE_EURO[interpolationYear1];
    const interpolationValue2 = CO2_EQ_MONETARY_VALUE_EURO[interpolationYear2];

    const coefficient = (year - interpolationYear1) / (interpolationYear2 - interpolationYear1);

    return (
      CO2_EQ_MONETARY_VALUE_EURO[interpolationYear1] *
      Math.pow(interpolationValue2 / interpolationValue1, coefficient)
    );
  }

  static getYearCO2EqEmittedPerVehiculeKilometerValue(year: number) {
    if (year >= 2050) {
      return CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER[2050];
    }

    if (year === 2015 || year === 2030 || year === 2050) {
      return CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER[year];
    }

    const [interpolationYear1, interpolationYear2]: [
      Co2EqEmittedPerVehiculeKilometerYearValue,
      Co2EqEmittedPerVehiculeKilometerYearValue,
    ] = year < 2030 ? [2015, 2030] : [2030, 2050];

    const interpolationValue1 = CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER[interpolationYear1];
    const interpolationValue2 = CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER[interpolationYear2];

    const coefficient = (year - interpolationYear1) / (interpolationYear2 - interpolationYear1);

    return (
      CO2_EQ_EMITTED_PER_VEHICULE_KILOMETER[interpolationYear1] *
      Math.pow(interpolationValue2 / interpolationValue1, coefficient)
    );
  }

  static getDiscountFactor(nbYears: number) {
    return 1 / Math.pow(1.045, nbYears);
  }

  sum(firstYearValue: number, options?: { roundFn: (_: number) => number }) {
    const roundFn = options?.roundFn ?? roundTo2Digits;
    return roundFn(firstYearValue * this.evaluationPeriodInYears);
  }

  sumWithDiscountFactor(
    firstYearValue: number,
    options?: { startYearIndex?: number; endYearIndex?: number },
  ) {
    return roundToInteger(
      sumList(
        Array(this.evaluationPeriodInYears)
          .fill(firstYearValue, options?.startYearIndex, options?.endYearIndex)
          .map(
            (value, yearIndex) => value * SumOnEvolutionPeriodService.getDiscountFactor(yearIndex),
          ),
      ),
    );
  }

  sumWithDiscountFactorAndGDPEvolution(firstYearValue: number) {
    return roundToInteger(
      sumList(
        Array(this.evaluationPeriodInYears)
          .fill(firstYearValue)
          .map(
            (value, yearIndex) =>
              value *
              SumOnEvolutionPeriodService.getDiscountFactor(yearIndex) *
              SumOnEvolutionPeriodService.getYearGrossDomesticProductPerCapitaEvolution(
                this.operationsFirstYear + yearIndex,
              ),
          ),
      ),
    );
  }

  sumWithDiscountFactorAndCO2ValueEvolution(firstYearValue: number) {
    return roundToInteger(
      sumList(
        Array(this.evaluationPeriodInYears)
          .fill(firstYearValue)
          .map(
            (value, yearIndex) =>
              value *
              SumOnEvolutionPeriodService.getDiscountFactor(yearIndex) *
              SumOnEvolutionPeriodService.getYearCO2MonetaryValue(
                this.operationsFirstYear + yearIndex,
              ),
          ),
      ),
    );
  }

  sumWithCO2EqEmittedPerVehiculeKilometerEvolution(firstYearValue: number) {
    return roundToInteger(
      sumList(
        Array(this.evaluationPeriodInYears)
          .fill(firstYearValue)
          .map(
            (value, yearIndex) =>
              value *
              SumOnEvolutionPeriodService.getYearCO2EqEmittedPerVehiculeKilometerValue(
                this.operationsFirstYear + yearIndex,
              ),
          ),
      ),
    );
  }

  sumWithCustomFn(
    firstYearValue: number,
    customFn: (value: number, index: number, context: { operationsFirstYear: number }) => number,
  ) {
    return roundToInteger(
      sumList(
        Array(this.evaluationPeriodInYears)
          .fill(firstYearValue)
          .map((value: number, yearIndex: number) =>
            customFn(value, yearIndex, { operationsFirstYear: this.operationsFirstYear }),
          ),
      ),
    );
  }
}
