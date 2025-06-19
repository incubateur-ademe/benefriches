import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

const EnvironmentalMainDescription = () => {
  return (
    <ModalBody>
      <ModalHeader
        title="Impacts environnementaux"
        breadcrumbSegments={[{ label: "Impacts environnementaux" }]}
      />
      <ModalContent>
        <p>Les impacts environnementaux se décompose en différents types d'indicateurs :</p>
        <ul>
          <li>les quantités de CO2-eq stocké ou d'émissions de CO2-eq évitées,</li>
          <li>la surface non polluée,</li>
          <li>la surface perméable, qu'elle soit végétalisée ou non.</li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default EnvironmentalMainDescription;
