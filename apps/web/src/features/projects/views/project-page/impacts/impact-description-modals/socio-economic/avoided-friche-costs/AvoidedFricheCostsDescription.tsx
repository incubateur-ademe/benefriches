import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import {
  mainBreadcrumbSection,
  economicDirectMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

const AvoidedFricheExpensesDescription = () => {
  return (
    <>
      <ModalHeader
        title="🏚 Dépenses de gestion et de sécurisation de la friche évitées"
        subtitle="Grâce à la reconversion de la friche"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          economicDirectMonetaryBreadcrumbSection,
          { label: "Dépenses friche évitées" },
        ]}
      />
      <ModalContent>
        <p>
          Un site qui reste en l'état, sans intervention, induit des coûts importants, à la charge
          de l'ancien locataire ou du propriétaire du terrain :
        </p>
        <ul>
          <li>De manière directe, via la fiscalité locale (taxe foncière)</li>
          <li>
            De manière indirecte car lorsqu'aucun moyen de préservation n'est mis en œuvre sur un
            site (clôture, gardiennage, taille, etc.), celui-ci se dégrade de manière naturelle ou
            par l'intermédiaire de dégradation volontaire ou de vandalisme (vol de métaux, casse de
            vitres, incendie, dépôts sauvages) ou de squats, engendrant une perte financière (valeur
            du bien) voire une augmentation des dépenses de réhabilitation
          </li>
        </ul>
        <p>
          Sauf en cas de défaillance du locataire (faillite, liquidation judiciaire, etc.) les
          dépenses de gardiennage, d'entretien, d'enlèvement de déchets sont à la charge de ce
          dernier.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : actuel locataire ou propriétaire
        </p>
      </ModalContent>
    </>
  );
};

export default AvoidedFricheExpensesDescription;
