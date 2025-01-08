import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

const EnvironmentalMainDescription = () => {
  return (
    <>
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
    </>
  );
};

export default EnvironmentalMainDescription;
