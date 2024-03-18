export type ReconversionProjectImpacts = {
  permeableSurfaceArea: {
    base: number;
    forecast: number;
    difference: number;
    greenSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
    mineralSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
  };
  contaminatedSurfaceArea?: { base: number; forecast: number; difference: number };
  fullTimeJobs: {
    current: number;
    forecast: number;
    conversion: { current: number; forecast: number };
    operations: { current: number; forecast: number };
  };
  accidents?: {
    current: number;
    forecast: 0;
    severeInjuries: {
      current: number;
      forecast: 0;
    };
    minorInjuries: {
      current: number;
      forecast: 0;
    };
    deaths: {
      current: number;
      forecast: 0;
    };
  };
  householdsPoweredByRenewableEnergy?: {
    current: 0;
    forecast: number;
  };
};
