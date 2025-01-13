import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const NonContaminatedSurfaceDescription = () => {
  return (
    <>
      <ModalHeader
        title="✨ Surface non polluée"
        breadcrumbSegments={[breadcrumbSection, { label: "Surface non polluée" }]}
      />
      <ModalContent>
        <p>
          Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
          activités passées. Réaliser un projet sur un tel site implique donc souvent la mise en
          place de mesure de gestion des pollutions (ex : traitement de dépollution) pour réduire la
          surface polluée et les risques associés, pour les futurs usagers (habitants, salariés,
          etc.).
        </p>
        <p>
          La surface non polluée est une donnée saisie par l'utilisateur pour le site et pour le
          projet.
        </p>
      </ModalContent>
    </>
  );
};

export default NonContaminatedSurfaceDescription;
