import Button from "@codegouvfr/react-dsfr/Button";
import { ImpactDescriptionModalCategory } from "../ImpactDescriptionModalWizard";
import ModalTitleTwo from "../shared/ModalTitleTwo";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
};

const CostBenefitAnalysisDescription = ({ onChangeModalCategoryOpened }: Props) => {
  return (
    <>
      <p>
        Bénéfriches repose sur les principes de l’analyse coûts-bénéfices, qui a pour objet
        d’apprécier l’intérêt d’une opération (projet ou investissement), sur une période donnée.
      </p>
      <p>
        Elle est réalisée en analysant les impacts du projet sur les différents types d’acteurs
        directement ou indirectement concernés, que ces impacts soient positifs ou négatifs. Puis en
        les comparant au bilan de l’opération (recettes vs. dépenses nécessaires à sa réalisation).
      </p>

      <ul className="tw-list-none">
        <li>
          <Button
            onClick={() => {
              onChangeModalCategoryOpened("economic-balance");
            }}
            priority="tertiary no outline"
          >
            📉 Bilan de l’opération
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              onChangeModalCategoryOpened("socio-economic");
            }}
            priority="tertiary no outline"
          >
            🌍 Impacts socio-économiques
          </Button>
        </li>
      </ul>

      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://www.strategie.gouv.fr/publications/guide-de-levaluation-socioeconomique-investissements-publics">
            Guide de l’évaluation socioéconomique des investissements publics
          </ExternalLink>
        </li>
        <li>
          Évaluation socioéconomique des opérations d’aménagement urbain :{" "}
          <ExternalLink href="https://www.strategie.gouv.fr/publications/referentiel-methodologique-de-levaluation-socioeconomique-operations-damenagement">
            Référentiel&nbsp;méthodologique
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default CostBenefitAnalysisDescription;
