import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { breadcrumbSegments } from "./breadcrumbSegments";

const PermeableGreenSurfaceDescription = () => {
  return (
    <ModalBody size="small">
      <ModalHeader
        title="☘️ Surface végétalisée"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Surface végétalisée" }]}
      />
      <ModalContent>
        <p>
          Il s'agit de la surface non imperméabilisée dont le revêtement permet le développement de
          végétation (par opposition à la surface perméable minérale) : terre végétale, sol enherbé,
          arbustif ou arboré, prairie, culture, vergers, vignes, forêt, technosols.
        </p>
        <p>
          La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
          l'utilisateur, pour le site et pour le projet.
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default PermeableGreenSurfaceDescription;
