import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";

import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
};

const CarbonSoilsStorageEnvironmentalDescription = (props: Props) => {
  return <CarbonSoilsStorageDescription withMonetarisation={false} {...props} />;
};

export default CarbonSoilsStorageEnvironmentalDescription;
