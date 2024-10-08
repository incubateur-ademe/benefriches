import { SoilsDistribution } from "shared";

import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const CarbonSoilsStorageMonetaryValueDescription = (props: Props) => {
  return <CarbonSoilsStorageDescription withMonetarisation={true} {...props} />;
};

export default CarbonSoilsStorageMonetaryValueDescription;
