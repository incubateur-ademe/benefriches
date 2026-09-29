import type { SiteReconversionType } from "../readFeatures.helpers";
import type { ItemScoreResult } from "../scoring.helpers";

export const getLivingEnvironmentScore = (
  siteReconversionType: SiteReconversionType,
): ItemScoreResult<{ siteReconversionType: SiteReconversionType }> => {
  if (siteReconversionType === "friche") {
    return {
      letterScore: "A",
      metrics: { siteReconversionType },
    };
  }
  return undefined;
};
