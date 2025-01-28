import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

const SocialMainDescription = () => {
  return (
    <ModalBody>
      <ModalHeader title="Impacts sociaux" breadcrumbSegments={[{ label: "Impacts sociaux" }]} />
      <ModalContent>
        <p>La catégorie des impacts sociaux regroupe les impacts :</p>
        <ul>
          <li>sur l'emploi</li>
          <li>sur la population locale</li>
          <li>sur la société française</li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default SocialMainDescription;
