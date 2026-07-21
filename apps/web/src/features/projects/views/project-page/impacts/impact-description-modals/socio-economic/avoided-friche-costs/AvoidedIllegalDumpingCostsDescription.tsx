import { AvoidedFricheCostsIndirectEconomicImpactItemView } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getBreadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  addressLabel: string;
  impactData?: number;
  bearerName: string;
  sectionName: SocioEconomicSubSectionName;
  impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["name"];
};

const AvoidedIllegalDumpingCostsDescription = ({
  addressLabel,
  impactData,
  bearerName,
  sectionName,
  impactName,
}: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🚮 Débarras de dépôt sauvage"
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
          { label: "Débarras de dépôt sauvage" },
        ]}
      />
      <ModalContent fullWidth>
        <p>
          De par sa vacance, le site peut subir des incivilités tels que des dépôts sauvages, dont
          l’enlèvement est coûteux !
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
          <li>
            Ratio moyen de production de déchets retrouvés dans les dépôts sauvages : 4.7
            kg/habitant/an
          </li>
          <li>
            Coût moyen de gestion (enlèvement, traitement) des déchets de dépôts sauvages : 900
            €/tonne
          </li>
          <li>Population communale</li>
        </ul>

        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>Adresse : {addressLabel}</p>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Le calcul consiste à multiplier le ratio de production de déchets retrouvés dans les
          dépôts sauvages par le coût moyen de gestion de ces déchets. Le site ne pouvant être le
          seul lieu de dépôts sauvages de la commune, un facteur d’occurrence est appliqué (estimé
          égal à 1/50).
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>

        <ul>
          <li>
            <ExternalLink href="https://librairie.ademe.fr/dechets-economie-circulaire/2278-caracterisation-de-la-problematique-des-dechets-sauvages.html">
              ADEME, Caractérisation de la problématique des déchets sauvages 2019
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://geo.api.gouv.fr/decoupage-administratif/communes">
              Etalab, Population par commune
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedIllegalDumpingCostsDescription;
