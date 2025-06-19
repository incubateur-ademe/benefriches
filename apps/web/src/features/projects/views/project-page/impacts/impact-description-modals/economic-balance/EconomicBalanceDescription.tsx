import { useContext } from "react";
import { roundTo2Digits } from "shared";

import { getEconomicBalanceProjectImpacts } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getEconomicBalanceImpactColor } from "../../getImpactColor";
import { getEconomicBalanceImpactLabel } from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import ModalTable from "../shared/ModalTable";
import ModalColumnSeriesChart from "../shared/modal-charts/ModalColumnSeriesChart";

type Props = {
  impactsData: ModalDataProps["impactsData"];
  projectData: ModalDataProps["projectData"];
};

const EconomicBalanceDescription = ({ impactsData, projectData }: Props) => {
  const { economicBalance, total, bearer } = getEconomicBalanceProjectImpacts(
    projectData.developmentPlan.type,
    impactsData,
  );
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const impactList = economicBalance.map(({ value, name }) => ({
    label: getEconomicBalanceImpactLabel(name),
    color: getEconomicBalanceImpactColor(name),
    value: roundTo2Digits(value),
    name,
  }));

  return (
    <ModalBody size="large">
      <ModalHeader
        title="📉 Bilan de l'opération"
        value={{
          state: total > 0 ? "success" : "error",
          text: formatMonetaryImpact(total),
          description: `pour ${bearer}`,
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
            exportSubtitle={`pour ${bearer}`}
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
              actor: bearer ?? "Aménageur",
              onClick: () => {
                updateModalContent({
                  sectionName: "economic_balance",
                  impactName: name,
                });
              },
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
