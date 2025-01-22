import { SoilsDistribution } from "shared";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import SoilsStorageRelatedCo2Content from "../../shared/co2-emissions/SoilsStorageRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const SoilsStorageRelatedCo2MonetaryValueDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="🍂 CO2-eq stocké dans les sols"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent>
        <SoilsStorageRelatedCo2Content withMonetarisation={true} {...props} />
      </ModalContent>
    </>
  );
};

export default SoilsStorageRelatedCo2MonetaryValueDescription;
