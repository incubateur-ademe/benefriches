import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

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
