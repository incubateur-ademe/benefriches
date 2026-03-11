import { FricheActivity } from "./fricheActivity";

export const computeDefaultDecontaminatedSurfaceArea = (contaminatedSoilSurface: number): number =>
  contaminatedSoilSurface * 0.25;

export const getContaminatedPercentageFromFricheActivity = (fricheActivity: FricheActivity) => {
  switch (fricheActivity) {
    case "INDUSTRY":
      return 0.5;
    case "MILITARY":
      return 0.05;
    case "RAILWAY":
      return 0.1;
    case "PORT":
      return 0.15;
    case "TIP_OR_RECYCLING_SITE":
      return 0.05;
    case "AGRICULTURE":
    case "BUILDING":
    case "OTHER":
      return 0;
  }
};
