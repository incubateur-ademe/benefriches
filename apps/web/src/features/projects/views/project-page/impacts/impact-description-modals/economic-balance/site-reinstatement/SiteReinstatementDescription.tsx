import { useContext } from "react";
import { EconomicBalanceImpactResult } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getSiteReinstatementDetailsColor } from "../../../getImpactColor";
import { getEconomicBalanceDetailsImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { breadcrumbSection } from "../breadcrumbSection";

type Props = {
  impactData?: EconomicBalanceImpactResult["costs"]["siteReinstatement"];
  bearer?: string;
};

const SiteReinstatementDescription = ({ impactData, bearer = "l'aménageur" }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const impactList =
    impactData?.costs.map(({ amount, purpose }) => ({
      label: getEconomicBalanceDetailsImpactLabel("site_reinstatement", purpose),
      color: getSiteReinstatementDetailsColor(purpose),
      value: -amount,
      name: purpose,
    })) ?? [];

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🚧 Remise en état de la friche"
        breadcrumbSegments={[breadcrumbSection, { label: "Remise en état de la friche" }]}
        value={
          impactData
            ? {
                state: "error",
                text: formatMonetaryImpact(-impactData.total),
                description: `pour ${bearer}`,
              }
            : undefined
        }
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart
            format="monetary"
            data={impactList}
            exportTitle="🚧 Remise en état de la friche"
          />

          <ModalTable
            caption="Liste des dépenses et recettes de remise en état"
            data={impactList.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              actor: bearer,
              onClick: () => {
                updateModalContent({
                  sectionName: "economic_balance",
                  impactName: "site_reinstatement",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>
        <ModalContent>
          <p>
            Le recyclage de friches ou de fonciers déjà artificialisés implique le plus souvent des
            études et de travaux du fait des activités passées qu’elles ont accueillies : présence
            de bâtiments, de pollution dans les sols, etc. Le recyclage impose une phase de remise
            en état, préalable à l’aménagement du site : intervention sur les bâtiments
            (réhabilitation, déconstruction, désamiantage, retrait de peintures au plomb),
            désimperméabilisation des sols, dépollution des milieux (sols, eaux souterraines, …),
            évacuation et traitement de déchets présents (dépôts sauvages par exemple), voire
            restauration écologique des sols.
          </p>
          <p>Cette phase génère des dépenses parfois importantes.</p>
          <p>
            <strong>Déficitaire</strong> : exploitant
          </p>

          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
          <ul>
            <li>
              ADEME&nbsp;:{" "}
              <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/4-ademe_rna_2023-11-23.pdf">
                Coût du recyclage des friches ex-ICPE polluées (Analyse des lauréats du Fonds
                Friches 2021-2022).
              </ExternalLink>
            </li>
            <li>
              CEREMA&nbsp;:{" "}
              <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/3-231123_rna_prez_jm.pdf">
                Coût de recyclage des friches non ICPE (Analyse des lauréats du Fonds Friches
                2021-2022).
              </ExternalLink>
            </li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default SiteReinstatementDescription;
