import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const RealEstateAcquisitionDescription = () => {
  return (
    <>
      <ModalHeader
        title="🏠 Acquisition du site"
        breadcrumbSegments={[breadcrumbSection, { label: "Acquisition du site" }]}
      />
      <ModalContent>
        <p>
          Il s'agit des dépenses d'acquisition foncière (y compris bâtiments) nécessaires à la
          réalisation du projet, auxquelles s'ajoutent les éventuels frais d'enregistrement (« frais
          de notaire ») et autres frais (frais d'évictions, etc.).
        </p>
        <p>La valeur est saisie par l'utilisateur.</p>
        <p>
          <strong>Déficitaire</strong> : futur propriétaire
        </p>
      </ModalContent>
    </>
  );
};

export default RealEstateAcquisitionDescription;
