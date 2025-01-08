import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

const EconomicBalanceDescription = () => {
  return (
    <>
      <ModalHeader
        title="📉 Bilan de l'opération"
        breadcrumbSegments={[
          {
            label: "Bilan de l'opération",
          },
        ]}
      />
      <ModalContent>
        <p>
          Le bilan d'opération regroupe l'ensemble des recettes et des dépenses d'une opération
          d'aménagement ou de construction. Son périmètre est donc circonscrit au porteur du projet.
        </p>
        <p>
          <strong>Bénéficiaires / déficitaires</strong> : exploitant, aménageur, futur propriétaire
        </p>

        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://outil2amenagement.cerema.fr/outils/bilan-amenageur">
              Outil aménagement CEREMA
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/2016-02-22_-_ApprocheSCET-OptimisationEconomiqueOperationsAmenagement.pdf">
              L'optimisation des dépenses des opérations d'aménagement
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default EconomicBalanceDescription;
