import { useContext } from "react";
import { roundTo2Digits } from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { buildEconomicBalanceListView } from "@/features/projects/core/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getEconomicBalanceImpactLabel } from "../../shared/getImpactLabel";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import { getEconomicBalanceImpactColor } from "../colors";
import ModalColumnSeriesChart from "../modal-charts/ModalColumnSeriesChart";
import ModalBody from "../modal-layout/ModalBody";
import ModalContent from "../modal-layout/ModalContent";
import ModalData from "../modal-layout/ModalData";
import ModalGrid from "../modal-layout/ModalGrid";
import ModalHeader from "../modal-layout/ModalHeader";
import ModalTitleTwo from "../modal-layout/ModalTitleTwo";
import ModalTable from "../modal-table/ModalTable";

type Props = {
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

const EconomicBalanceDescription = ({ impactsData, contextData }: Props) => {
  const { economicBalance, total, bearerName } = buildEconomicBalanceListView(
    contextData.projectDevelopmentPlan.type,
    impactsData,
  );
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  const impactList = economicBalance.map(({ total, keyName: name }) => ({
    label: getEconomicBalanceImpactLabel(name),
    color: getEconomicBalanceImpactColor(name),
    value: roundTo2Digits(total),
    name,
  }));

  return (
    <ModalBody size="large">
      <ModalHeader
        title="📉 Bilan de l'opération"
        value={{
          state: total > 0 ? "success" : "error",
          text: formatMonetaryImpact(total),
          description: `pour ${bearerName}`,
        }}
        breadcrumbSegments={[
          {
            label: "Bilan de l'opération",
          },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnSeriesChart
            format="monetary"
            exportTitle="📉 Bilan de l'opération"
            exportSubtitle={`pour ${bearerName}`}
            data={[
              {
                label: "Recettes",
                values: impactList.filter(({ value }) => value > 0),
              },
              {
                label: "Dépenses",
                values: impactList.filter(({ value }) => value < 0),
              },
            ]}
          />

          <ModalTable
            caption="Liste des dépenses et recettes liées au projet et au site"
            data={impactList.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              linkProps: getDetailsLink({
                sectionName: "economicBalance",
                impactDetailsName: name,
              }),
            }))}
          />
        </ModalData>
        <ModalContent>
          <p>
            Le bilan d'opération regroupe l'ensemble des recettes et des dépenses d'une opération
            d'aménagement ou de construction. Son périmètre est donc circonscrit au porteur du
            projet.
          </p>
          <p>
            <strong>Bénéficiaires / déficitaires</strong> : exploitant, aménageur, futur
            propriétaire
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
      </ModalGrid>
    </ModalBody>
  );
};

export default EconomicBalanceDescription;
