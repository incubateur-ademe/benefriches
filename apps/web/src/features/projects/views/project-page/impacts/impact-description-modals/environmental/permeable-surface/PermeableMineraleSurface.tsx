import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { breadcrumbSegments } from "./breadcrumbSegments";

const PermeableMineraleSurfaceDescription = () => {
  return (
    <ModalBody size="small">
      <ModalHeader
        title="🪨 Surface minérale"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Surface minérale" }]}
      />
      <ModalContent>
        <p>
          Il s'agit de la surface non imperméabilisée dont le revêtement est minéral : granulat,
          gravier, cailloux, roche mère ou sol nu non recouvert de terre végétale ou de végétation.
        </p>
        <p>
          La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
          l'utilisateur, pour le site et pour le projet.
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default PermeableMineraleSurfaceDescription;
