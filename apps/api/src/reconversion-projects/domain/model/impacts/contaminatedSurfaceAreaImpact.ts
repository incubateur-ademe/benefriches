type ContaminatedSurfaceAreaImpactInput = {
  currentContaminatedSurfaceArea: number;
};

export type ContaminatedSurfaceAreaImpact = {
  base: number;
  forecast: number;
  difference: number;
};

export const computeContaminatedSurfaceAreaImpact = (input: ContaminatedSurfaceAreaImpactInput) => {
  return {
    base: input.currentContaminatedSurfaceArea,
    forecast: 0,
    difference: 0 - input.currentContaminatedSurfaceArea,
  };
};
