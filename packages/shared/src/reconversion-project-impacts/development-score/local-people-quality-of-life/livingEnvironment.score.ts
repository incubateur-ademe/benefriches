import type { SiteReconversionType } from "../readFeatures.helpers";
import type { ScoredMetrics } from "../scoring.helpers";

export const getLivingEnvironmentScore = (
  siteReconversionType: SiteReconversionType,
): ScoredMetrics<{ siteReconversionType: SiteReconversionType }> => {
  if (siteReconversionType === "friche") {
    return {
      letterGrade: "A",
      metrics: { siteReconversionType },
    };
  }
  if (siteReconversionType === "friche_agricole") {
    return {
      letterGrade: "D",
      metrics: { siteReconversionType },
    };
  }
  if (siteReconversionType === "enaf") {
    return {
      letterGrade: "E",
      metrics: { siteReconversionType },
    };
  }
  return undefined;
};
