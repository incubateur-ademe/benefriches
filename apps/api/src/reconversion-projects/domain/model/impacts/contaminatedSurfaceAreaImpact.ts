type ContaminatedSurfaceAreaImpactInput = {
  currentContaminatedSurfaceArea: number;
};

export type ContaminatedSurfaceAreaImpact = {
  base: number;
  forecast: number;
};

export const computeContaminatedSurfaceAreaImpact = (input: ContaminatedSurfaceAreaImpactInput) => {
  return {
    base: input.currentContaminatedSurfaceArea,
    forecast: 0,
  };
};
