import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { localAuthorityBreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  surfaceArea: number;
  impactData?: number;
};

const RoadsAndUtilitiesMaintenanceExpenses = ({ surfaceArea, impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🅿️ Dépenses d’entretien des VRD"
        subtitle="Grâce à l’aménagement du projet en zone urbaine"
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
          localAuthorityBreadcrumbSection,
          { label: "Dépenses d’entretien des VRD" },
        ]}
      />
      <ModalContent fullWidth>
        <p>
          L’entretien des réseaux et voiries (VRD) est proportionnel à l’ampleur de ces VRD.
          L’impact de cet entretien est donc moindre en reconversion qu’en extension. Toutefois, en
          cas de scénario statu quo, ces dépenses sont un impact économique indirect qui est
          négatif.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : Collectivité
        </p>

        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Dépense moyenne d’entretien/maintenance annuel dans les VRD (exprimé en €/ha/an)&nbsp;:
            7&nbsp;520&nbsp;€2018/ha/an
          </li>
        </ul>

        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit ici de la surface
          du site (exprimée en hectare).
        </p>
        <p>
          <strong>Surface du site :</strong> {formatSurfaceArea(surfaceArea)}
        </p>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          L’impact économique est calculé en multipliant la surface du site (exprimée en ha) à la
          donnée systémique « dépense moyenne d’entretien / maintenance annuel dans les VRD »
          (exprimée en €/ha/an).
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>

        <ul>
          <li>
            <ExternalLink href="https://www.urbanisme-puca.gouv.fr/evaluation-en-cout-global-d-un-projet-et-d-une-a1492.html">
              Plan Urbanisme Construction Architecture, Evaluation en coût global d’un projet et
              d’une opération d’aménagement (2018)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.normandie.developpement-durable.gouv.fr/IMG/pdf/03-7_Cout_global_extension_-_renouvellement_Etude_du_CAUE_54.pdf">
              Étude comparative en coût global entre un projet en extension de bourg et un projet en
              renouvellement urbain, CAUE 54 (2008)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://issuu.com/sgparis141617/docs/dossier_ep_ligne16_volet_e4">
              Enquête publique ligne 16 volet E4, Société du Grand Paris (2016)
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default RoadsAndUtilitiesMaintenanceExpenses;
