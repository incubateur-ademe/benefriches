import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { mainBreadcrumbSection, soilsBreadcrumbSection } from "../breadcrumbSections";

const NonContaminatedSurfaceDescription = () => {
  return (
    <ModalBody>
      <ModalHeader
        title="✨ Surface non polluée"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          soilsBreadcrumbSection,
          { label: "Surface non polluée" },
        ]}
      />
      <ModalContent>
        <p>
          Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
          activités passées. Réaliser un projet sur un tel site implique donc souvent la mise en
          place de mesure de gestion des pollutions (ex : traitement de dépollution) pour réduire
          l’ampleur de la pollution (surface occupée, teneurs présentes, etc.) et les risques
          sanitaires associés, pour les futurs usagers (habitants, salariés, etc.).
        </p>
        <p>
          La surface non polluée est une donnée saisie par l'utilisateur pour le site et pour le
          projet.
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default NonContaminatedSurfaceDescription;
