import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import { ImpactsData } from "../ImpactModalDescriptionProvider";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalData from "../shared/ModalData";
import ModalGrid from "../shared/ModalGrid";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

type Props = {
  impactsData: ImpactsData;
};

const title = "Analyse coûts bénéfices";

const CostBenefitAnalysisDescription = ({ impactsData }: Props) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const { economicBalance, socioeconomic } = impactsData;

  return (
    <ModalBody size="large">
      <ModalHeader title={`⚖️ ${title}`} breadcrumbSegments={[{ label: title }]} />

      <ModalGrid>
        <ModalData>
          <div className="tw-mb-10">
            <HighchartsReact
              containerProps={{ className: "highcharts-no-xaxis" }}
              highcharts={Highcharts}
              options={withDefaultBarChartOptions({
                xAxis: {
                  categories: [
                    `<strong>Bilan de l'opération</strong><br>${formatMonetaryImpact(economicBalance.total)}`,
                    `<strong>Impacts socio-économiques</strong><br>${formatMonetaryImpact(socioeconomic.total)}`,
                  ],
                },
                tooltip: {
                  enabled: false,
                },
                legend: {
                  enabled: false,
                },
                series: [
                  {
                    name: "Analyse coûts/bénéfices",
                    type: "column",
                    data: [economicBalance.total, socioeconomic.total],
                  },
                ],
              })}
            />
          </div>

          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={economicBalance.total}
              label="📉 Bilan de l'opération"
              type="monetary"
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "economic_balance",
                });
              }}
            />
          </ImpactItemGroup>
          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={socioeconomic.total}
              label="🌍 Impacts socio-économiques"
              type="monetary"
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "socio_economic",
                });
              }}
            />
          </ImpactItemGroup>
        </ModalData>
        <ModalContent>
          <p>
            BENEFRICHES repose sur les principes de l’analyse coûts-bénéfices, qui a pour objet
            d’apprécier l’intérêt d’une opération (projet ou investissement), sur une période
            donnée. Elle est réalisée en analysant les impacts du projet sur les différents types
            d’acteurs directement ou indirectement concernés, que ces impacts soient positifs ou
            négatifs. Puis en les comparant au bilan de l’opération (recettes vs. dépenses
            nécessaires à sa réalisation).
          </p>

          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>

          <ul>
            <li>
              <ExternalLink href="https://www.strategie.gouv.fr/publications/guide-de-levaluation-socioeconomique-investissements-publics">
                Guide de l’évaluation socioéconomique des investissements publics
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.strategie.gouv.fr/publications/referentiel-methodologique-de-levaluation-socioeconomique-operations-damenagement">
                Référentiel méthodologique de l’évaluation socioéconomique des opérations
                d’aménagement urbain
              </ExternalLink>
            </li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default CostBenefitAnalysisDescription;
