import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { mainBreadcrumbSection, economicIndirectBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData?: number;
};
const PropertyTransferDutiesIncreaseDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🏛 Droits de mutation sur la transaction foncière"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour la collectivité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          economicIndirectBreadcrumbSection,
          { label: "Droits de mutation sur les ventes immobilières alentour" },
        ]}
      />
      <ModalContent fullWidth>
        <p>
          L’amélioration de l’attractivité liée au projet de reconversion va contribuer à un
          meilleur dynamise du marché immobilier avec à la clé un accroissement de rentrée fiscale
          pour les collectivités au travers des droits de mutation à titre onéreux (DMO).
        </p>
        <p>
          <strong>Bénéficiaire</strong> : Collectivité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Droits moyens de mutation à titre onéreux par transaction (Etat + département +
            collectivité territoriale) pour les logements : 5.81% du prix de vente
          </li>
          <li>Durée moyenne de détention des logements : 33 ans</li>
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          On considère que les biens immobiliers situés dans le périmètre d’influence du projets
          font l’objet de transactions répartis sur la durée moyenne de détention des logements.
        </p>
        <p>
          Les DMO annuels sont calculés en appliquant le taux moyen à la valeur patrimoniale des
          bâtiments alentours (cf. indicateur dédié “Valeur patrimoniale des bâtiments alentour”)
          divisée par la durée moyenne de détention des logements.
        </p>

        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006179720/">
              Code général des impôts
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.collectivites-locales.gouv.fr/droits-denregistrement-et-taxe-de-publicite-fonciere-sur-les-mutations-titre-onereux-dimmeubles-et">
              Droits d’enregistrement et taxe de publicité foncière sur les mutations à titre
              onéreux d’immeubles et de droits immobiliers
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default PropertyTransferDutiesIncreaseDescription;
