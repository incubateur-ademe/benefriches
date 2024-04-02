import { fr } from "@codegouvfr/react-dsfr";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const EconomicBalanceDescription = () => {
  return (
    <>
      <p>
        Le bilan d’opération regroupe l’ensemble des recettes et des dépenses d’une opération
        d’aménagement ou de construction. Son périmètre est donc circonscrit au porteur du projet.
      </p>
      <p>
        <strong>Bénéficiaires / déficitaires</strong> : exploitant, aménageur, futur propriétaire
      </p>

      <h2 className={fr.cx("fr-h5")}>Aller plus loin</h2>
      <ul>
        <li>
          <ExternalLink href="https://outil2amenagement.cerema.fr/outils/bilan-amenageur">
            Outil aménagement CEREMA
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/2016-02-22_-_ApprocheSCET-OptimisationEconomiqueOperationsAmenagement.pdf">
            L’optimisation des coûts des opérations d’aménagement
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default EconomicBalanceDescription;
