import { useContext } from "react";

import {
  EconomicBalanceMainName,
  getEconomicBalanceProjectImpacts,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData } from "../ImpactModalDescriptionProvider";
import ModalBarColoredChart from "../shared/ModalBarColoredChart";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalData from "../shared/ModalData";
import ModalGrid from "../shared/ModalGrid";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

type Props = {
  impactsData: ImpactsData;
  projectData: ProjectData;
};

const getChartColor = (impactName: EconomicBalanceMainName): string => {
  switch (impactName) {
    case "site_reinstatement":
      return "#F4C00A";
    case "site_purchase":
      return "#F3F511";
    case "development_plan_installation":
    case "urban_project_development_plan_installation":
      return "#F57F0A";
    case "photovoltaic_development_plan_installation":
      return "#EF410F";
    case "site_resale":
    case "buildings_resale":
      return "#72D98D";
    case "financial_assistance":
      return "#14EA81";
    case "operations_costs":
      return "#C535A4";
    case "operations_revenues":
      return "#37C95D";
  }
};

const EconomicBalanceDescription = ({ impactsData, projectData }: Props) => {
  const { economicBalance, total, bearer } = getEconomicBalanceProjectImpacts(
    projectData.developmentPlan.type,
    impactsData,
  );
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

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
          <ModalBarColoredChart
            data={economicBalance.map(({ name, value }) => ({
              label: getEconomicBalanceImpactLabel(name),
              color: getChartColor(name),
              value,
            }))}
          />
          {economicBalance.map(({ name, value, details = [] }) => (
            <ImpactItemGroup isClickable key={name}>
              <ImpactItemDetails
                value={value}
                label={getEconomicBalanceImpactLabel(name)}
                type="monetary"
                onClick={() => {
                  openImpactModalDescription({ sectionName: "economic_balance", impactName: name });
                }}
                data={details.map(({ name: detailsName, value: detailsValue }) => ({
                  label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                  value: detailsValue,
                  onClick: () => {
                    openImpactModalDescription({
                      sectionName: "economic_balance",
                      impactName: name,
                      impactDetailsName: detailsName,
                    });
                  },
                }))}
              />
            </ImpactItemGroup>
          ))}
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
