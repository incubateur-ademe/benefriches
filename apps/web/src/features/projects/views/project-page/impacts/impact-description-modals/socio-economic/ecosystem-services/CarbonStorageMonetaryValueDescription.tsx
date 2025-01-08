import { SoilsDistribution } from "shared";

import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const CarbonSoilsStorageMonetaryValueDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="🍂️ Carbone stocké dans les sols"
        breadcrumbSegments={[
          {
            label: "Impacts socio-économiques",
            id: "socio-economic",
          },
          {
            label: "Impacts environnementaux monétarisés",
          },
          {
            label: "Services écosystémiques",
            id: "socio-economic.ecosystem-services",
          },
          { label: "Carbone stocké dans les sols" },
        ]}
      />
      <ModalContent>
        <CarbonSoilsStorageDescription withMonetarisation={true} {...props} />
      </ModalContent>
    </>
  );
};

export default CarbonSoilsStorageMonetaryValueDescription;
