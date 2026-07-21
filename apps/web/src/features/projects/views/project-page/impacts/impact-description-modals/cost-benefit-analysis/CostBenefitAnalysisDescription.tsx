import * as Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ModalDataProps } from "../ImpactModalDescription";
import ModalTable from "../shared/ModalTable";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const title = "Analyse coût bénéfice";

const CostBenefitAnalysisDescription = ({ impactsData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody size="large">
      <ModalHeader title={`⚖️ ${title}`} breadcrumbSegments={[{ label: title }]} />

      <ModalGrid>
        <ModalData>
          <div className="mb-10">
            <HighchartsReact
              containerProps={{ className: "highcharts-no-xaxis" }}
              highcharts={Highcharts}
              options={withDefaultBarChartOptions({
                xAxis: {
                  categories: [
                    `<strong>Bilan de l'opération</strong><br>${formatMonetaryImpact(impactsData.projectEconomicBalance.total)}`,
                    `<strong>Impacts socio-économiques</strong><br>${formatMonetaryImpact(impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total)}`,
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
                    data: [
                      impactsData.projectEconomicBalance.total,
                      impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
                    ],
                  },
                ],
              })}
            />
          </div>

          <ModalTable
            caption="Bilan de l'opération et impacts socio-économiques"
            data={[
              {
                label: "📉 Bilan de l'opération",
                value: impactsData.projectEconomicBalance.total,
                onClick: () => {
                  updateModalContent({
                    sectionName: "economic_balance",
                  });
                },
              },
              {
                label: "🌍 Impacts socio-économiques",
                value: impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
                onClick: () => {
                  updateModalContent({
                    sectionName: "socio_economic",
                  });
                },
              },
            ]}
          />
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

          <p>
            Afin de pouvoir comparer les valeurs de ces indicateurs au bilan de l’opération (qui est
            exprimé en €), il est nécessaire de convertir celles qui ne sont naturellement pas
            exprimées en € (ex : tonnes de CO2 évitées, surfaces désimperméabilisées) en valeurs
            monétaires. On parle alors de ”monétarisation”.
          </p>

          <p>
            Par ailleurs, conformément aux principes de l’évaluation socio-économique, Bénéfriches «
            actualise » les coûts et bénéfices futurs du projet pour pouvoir les comparer.
            Actualiser signifie « ramener à une valeur d’aujourd’hui ». Pour cela, on utilise un
            coefficient (ou taux) d’actualisation.
          </p>

          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>

          <ul>
            <li>
              <ExternalLink href="https://www.strategie.gouv.fr/levaluation-socioeconomique-investir-pour-la-collectivite">
                Infographie sur l’évaluation socio-économique, France Stratégie
              </ExternalLink>
            </li>

            <li>
              <ExternalLink href="https://www.strategie.gouv.fr/taux-dactualisation-un-beta-sensible">
                Infographie sur la notion d’actualisation, France Stratégie
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/AMC%20-%20Guide%20m%C3%A9thodologique%20ABC.pdf">
                Analyse coût bénéfices, Ministère de la transition écologique
              </ExternalLink>
            </li>
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
