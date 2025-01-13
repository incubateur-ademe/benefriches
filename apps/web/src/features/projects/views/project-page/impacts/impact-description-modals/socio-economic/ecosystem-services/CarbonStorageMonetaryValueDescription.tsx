import { SoilsDistribution } from "shared";

import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const CarbonSoilsStorageMonetaryValueDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="🍂️ Carbone stocké dans les sols"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent>
        <CarbonSoilsStorageDescription withMonetarisation={true} {...props} />
      </ModalContent>
    </>
  );
};

export default CarbonSoilsStorageMonetaryValueDescription;
