import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSegments } from "./breadcrumbSegments";

const PermeableMineraleSurfaceDescription = () => {
  return (
    <>
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
    </>
  );
};

export default PermeableMineraleSurfaceDescription;
