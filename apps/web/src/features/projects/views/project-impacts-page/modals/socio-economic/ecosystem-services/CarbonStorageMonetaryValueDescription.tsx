import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
};

const CarbonSoilsStorageMonetaryValueDescription = (props: Props) => {
  return <CarbonSoilsStorageDescription withMonetarisation={true} {...props} />;
};

export default CarbonSoilsStorageMonetaryValueDescription;
