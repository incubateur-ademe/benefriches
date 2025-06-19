import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

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
