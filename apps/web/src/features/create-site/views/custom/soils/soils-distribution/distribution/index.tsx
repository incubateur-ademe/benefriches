import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsDistributionByPercentage from "./by-percentage";
import SiteSoilsDistributionBySqMeter from "./by-square-meters";

function SiteSoilsDistributionContainer() {
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return siteData.soilsDistributionEntryMode === "total_surface_percentage" ? (
    <SiteSoilsDistributionByPercentage />
  ) : (
    <SiteSoilsDistributionBySqMeter />
  );
}

export default SiteSoilsDistributionContainer;
