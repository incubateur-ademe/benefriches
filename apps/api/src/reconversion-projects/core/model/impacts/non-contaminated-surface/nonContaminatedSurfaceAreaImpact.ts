type NonContaminatedSurfaceAreaImpactInput = {
  currentContaminatedSurfaceArea: number;
  totalSurfaceArea: number;
};

export type NonContaminatedSurfaceAreaImpact = {
  current: number;
  forecast: number;
};

export const computeNonContaminatedSurfaceAreaImpact = (
  input: NonContaminatedSurfaceAreaImpactInput,
): NonContaminatedSurfaceAreaImpact => {
  return {
    current: input.totalSurfaceArea - input.currentContaminatedSurfaceArea,
    forecast: input.totalSurfaceArea,
  };
};
