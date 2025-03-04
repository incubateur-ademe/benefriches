import { Impact } from "../impact";

type Props = {
  siteTotalSurfaceArea: number;
  contaminatedSurface?: number;
  decontaminatedSurface?: number;
};

export const getNonContaminatedSurfaceAreaImpact = ({
  siteTotalSurfaceArea,
  contaminatedSurface,
  decontaminatedSurface,
}: Props) => {
  const currentNonContaminatedSurfaceArea = siteTotalSurfaceArea - (contaminatedSurface ?? 0);
  return Impact.get({
    base: currentNonContaminatedSurfaceArea,
    forecast: currentNonContaminatedSurfaceArea + (decontaminatedSurface ?? 0),
  });
};
