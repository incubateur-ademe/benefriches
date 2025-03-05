import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import { mainBreadcrumbSection } from "./breadcrumbSections";

const SoilsSubSectionDescription = () => {
  return (
    <ModalBody size="small">
      <ModalHeader
        title="Impacts sur les sols"
        breadcrumbSegments={[mainBreadcrumbSection, { label: "Impacts sur les sols" }]}
      />
      <ModalContent>
        <p>
          Tout projet d’aménagement d’un site implique généralement une modification de l’usage des
          sols, que ce soit de manière bénéfique du point de vue environnemental (ex :
          désimperméabilisation), sanitaire (ex : dépollution) ou des écosystèmes (ex : restauration
          écologique des sols et végétalisation).
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default SoilsSubSectionDescription;
