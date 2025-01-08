import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";

const AvoidedVehiculeKilometersDescription = () => {
  return (
    <>
      <ModalHeader
        title="🚙 Kilomètres évités"
        breadcrumbSegments={[
          {
            label: "Impacts sociaux",
            id: "social",
          },
          { label: "Kilomètres évités" },
        ]}
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
