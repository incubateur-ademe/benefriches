import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSegments } from "./breadcrumbSegments";

const AvoidedOtherSecuringCostsDescription = () => {
  return (
    <>
      <ModalHeader
        title="🛡 Autres dépenses de sécurisation"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Autres dépenses de sécurisation" }]}
      />
      <ModalContent>
        <p>
          En plus des dépenses d’entretien, de débarras de dépôts sauvages ou de gardiennage,
          d’autres dépenses peuvent être nécessaires, par exemple pour la réparation de dommages non
          couverts par les assureurs (ex : incendie, réparation de clôture, portail ou dispositifs
          de fermeture).
        </p>
        <p>
          <strong>Bénéficiaire</strong> : actuel exploitant
        </p>

        <p>Les données du site ont été saisies par l’utilisateur·ice.</p>
      </ModalContent>
    </>
  );
};

export default AvoidedOtherSecuringCostsDescription;
