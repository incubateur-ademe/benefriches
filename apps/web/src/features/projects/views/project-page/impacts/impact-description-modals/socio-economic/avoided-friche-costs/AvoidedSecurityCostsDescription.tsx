import { AvoidedFricheCostsIndirectEconomicImpactItemView } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getBreadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  siteSurfaceArea: number;
  impactData?: number;
  bearerName: string;
  sectionName: SocioEconomicSubSectionName;
  impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["name"];
};

const AvoidedSecurityCostsDescription = ({
  siteSurfaceArea,
  impactData,
  bearerName,
  sectionName,
  impactName,
}: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="👮‍♀️ Gardiennage"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: `pour ${bearerName}`,
              }
            : undefined
        }
        breadcrumbSegments={[
          ...getBreadcrumbSegments(sectionName, impactName),
          { label: "Gardiennage" },
        ]}
      />
      <ModalContent fullWidth>
        <p>
          Afin d’éviter que le site ne dégrade de manière naturelle ou par l’intermédiaire de
          dégradation volontaire ou de vandalisme (ex&nbsp;: vol de métaux, casse de vitres,
          incendie) ou de squats, engendrant une perte financière (valeur du bien) voire une
          augmentation des dépenses de réhabilitation, un gardiennage du site peut être nécessaire.
        </p>
        <p>
          <strong>Bénéficiaire</strong> :{" "}
          {impactName === "avoidedFricheMaintenanceAndSecuringCostsForOwner"
            ? "actuel propriétaire"
            : "actuel locataire"}
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>Coût moyen de gardiennage (exprimé en €/ha/an)</li>
        </ul>
        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>Il s’agit de la surface totale occupée par le site (exprimée en hectare).</p>
        <ul>
          <li>{formatSurfaceArea(siteSurfaceArea)}</li>
        </ul>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Le calcul est le produit de la surface du site (exprimée en hectare) par le coût moyen de
          gardiennage (exprimé en €/ha/an).
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://hal.archives-ouvertes.fr/tel-01869918/document">
              Tendero Marjorie. Reconversion et aménagement durable des friches urbaines polluées :
              élaboration d'une méthode participative d'évaluation et d'aide multicritère à la
              décision. 2018. Agrocampus Ouest, Université de Bretagne Loire. Thèse ADEME
            </ExternalLink>
          </li>
          <li>
            Marchés de gardiennage de sites, passés par l’ADEME dans le cadre de sa mission de mise
            en sécurité de sites à responsables défaillants dans le cadre de l’Avis du Lien 3
          </li>
        </ul>

        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047553584">
              Avis relatif au processus d'intervention de l'ADEME en contexte de sites à
              responsables défaillants
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedSecurityCostsDescription;
