import * as Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { useContext, useId } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
// oxlint-disable-next-line import/no-unassigned-import
import "@/features/projects/views/project-break-even-level/charts/BreakEvenLevelChart.css";
import { useGetBreakEventLevelColumnChartProps } from "@/features/projects/views/project-break-even-level/charts/chart-options/breakEvenLevelChartOptions";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { useChartCustomSerieColors } from "@/shared/views/charts/useChartCustomColors";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTable from "../modal-table/ModalTable";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const title = "Analyse coût bénéfice";

const CostBenefitAnalysisDescription = ({ impactsData }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  const { options, containerProps } = useGetBreakEventLevelColumnChartProps({
    projectionYears: impactsData.projectionYears,
    ...impactsData.aggregatedReconversionImpacts,
  });

  const id = useId();

  useChartCustomSerieColors(id, ["#E0A227", "#22AFE5"]);

  return (
    <ModalBody size="large">
      <ModalHeader title={`⚖️ ${title}`} breadcrumbSegments={[{ label: title }]} />

      <ModalGrid>
        <ModalData>
          <div className="mb-10">
            <HighchartsReact
              containerProps={{ ...containerProps, id }}
              highcharts={Highcharts}
              options={options}
            />
          </div>

          <ModalTable
            caption="Bilan de l'opération et impacts socio-économiques"
            data={[
              {
                label: "📉 Bilan de l'opération",
                value: impactsData.projectEconomicBalance.total,
                color: "#E0A227",
                linkProps: getDetailsLink({ sectionName: "economicBalance" }),
              },
              {
                label: "🌍 Impacts socio-économiques",
                value: impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
                color: "#22AFE5",
                linkProps: getDetailsLink({ sectionName: "socioEconomic" }),
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
