type NonContaminatedSurfaceAreaImpactInput = {
  currentContaminatedSurfaceArea: number;
  forecastDecontaminedSurfaceArea: number;
  totalSurfaceArea: number;
};

export type NonContaminatedSurfaceAreaImpact = {
  current: number;
  forecast: number;
  difference: number;
};

export const computeNonContaminatedSurfaceAreaImpact = (
  input: NonContaminatedSurfaceAreaImpactInput,
): NonContaminatedSurfaceAreaImpact => {
  const currentNonContaminatedSurfaceArea =
    input.totalSurfaceArea - input.currentContaminatedSurfaceArea;
  const forecastNonContaminatedSurfaceArea =
    currentNonContaminatedSurfaceArea + input.forecastDecontaminedSurfaceArea;
  return {
    current: currentNonContaminatedSurfaceArea,
    forecast: forecastNonContaminatedSurfaceArea,
    difference: forecastNonContaminatedSurfaceArea - currentNonContaminatedSurfaceArea,
  };
};
