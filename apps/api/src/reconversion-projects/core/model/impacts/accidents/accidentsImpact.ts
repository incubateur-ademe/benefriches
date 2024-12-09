import { AccidentsImpactResult } from "shared";

type AccidentsImpactInput = {
  severeInjuries?: number;
  minorInjuries?: number;
  deaths?: number;
};

export const computeAccidentsImpact = (input: AccidentsImpactInput): AccidentsImpactResult => {
  const currentAccidents =
    (input.deaths ?? 0) + (input.severeInjuries ?? 0) + (input.minorInjuries ?? 0);

  return {
    current: currentAccidents,
    forecast: 0,
    deaths: {
      current: input.deaths ?? 0,
      forecast: 0,
    },
    severeInjuries: {
      current: input.severeInjuries ?? 0,
      forecast: 0,
    },
    minorInjuries: {
      current: input.minorInjuries ?? 0,
      forecast: 0,
    },
  };
};
