import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const AvoidedVehiculeKilometersDescription = () => {
  return (
    <>
      <ModalHeader
        title="🚙 Kilomètres évités"
        breadcrumbSegments={[breadcrumbSection, { label: "Kilomètres évités" }]}
      />
      <ModalContent>
        <p>
          Il s’agit du nombre de kilomètres totaux qui ne seront pas parcourus dans les transports
          par les personnes impactées par le projet.
        </p>
      </ModalContent>
    </>
  );
};

export default AvoidedVehiculeKilometersDescription;
