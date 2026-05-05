import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { BreakEvenLevelTabDataView } from "../../application/project-impacts/projectBreakEvenLevel.selectors";
import { selectImpactsPageViewData } from "../../core/projectImpacts.selectors";
import ProjectPageHeader from "../project-page/header/";
import BreakEvenLevalImpactsActionBar from "./ProjectBreakEvenLevelActionBar";
import ProjectBreakEvenLevelSection from "./ProjectBreakEvenLevelSection";
import ProjectBreakEvenLevelSummary from "./ProjectBreakEvenLevelSummary";
import BreakEvenLevelChart from "./charts/BreakEvenLevelChart";
import EconomicBalanceChart from "./charts/EconomicBalanceChart";
import HumanityIndirectEconomicImpactsCharts from "./charts/HumanityIndirectEconomicImpactsCharts";
import IndirectEconomicImpactsChart from "./charts/IndirectEconomicImpactsChart";
import LocalAuthorityIndirectEconomicImpactsCharts from "./charts/LocalAuthorityIndirectEconomicImpactsCharts";
import LocalPeopleOrCompanyIndirectEconomicImpactsCharts from "./charts/LocalPeopleOrCompanyIndirectEconomicImpactsCharts";

type Props = BreakEvenLevelTabDataView & { projectId: string };

export default function ProjectBreakEvenLevelTab({
  projectId,
  indirectEconomicImpacts,
  cumulativeBalanceByYear,
  projectionYears,
  breakEvenYear,
  economicBalance,
  indirectEconomicImpactsByBearer,
}: Props) {
  const dispatch = useAppDispatch();
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);

  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Analyse coût-bénéfice</h3>
        <BreakEvenLevalImpactsActionBar
          evaluationPeriod={evaluationPeriod}
          onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
            void dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }));
          }}
          header={<ProjectPageHeader projectId={projectId} />}
        />
      </div>

      <div className="grid grid-cols-8 gap-8">
        <div className="col-span-2">
          <ProjectBreakEvenLevelSummary
            breakEvenYear={breakEvenYear}
            projectionYears={projectionYears}
          />
        </div>

        <div className="col-start-3 col-span-6 highcharts-no-xaxis">
          <BreakEvenLevelChart
            values={cumulativeBalanceByYear}
            xValues={projectionYears}
            breakEvenIndex={breakEvenIndex}
            breakEvenYear={breakEvenYear}
          />
        </div>
      </div>
      <ProjectBreakEvenLevelSection
        title={`Bilan de l'opération ${economicBalance.total > 0 ? "positif" : "négatif"}`}
        subtitle="Pour l'aménageur."
        total={economicBalance.total}
        chart={<EconomicBalanceChart economicBalance={economicBalance} />}
      />

      <ProjectBreakEvenLevelSection
        title={`Impacts socio-économiques ${indirectEconomicImpacts.total > 0 ? "positifs" : "négatifs"}`}
        subtitle="Pour la collectivité locale, les riverains, la société fançaise et mondiale."
        total={indirectEconomicImpacts.total}
        chart={
          <IndirectEconomicImpactsChart
            indirectEconomicImpactsTotal={indirectEconomicImpacts.total}
            indirectEconomicImpactsByBearer={indirectEconomicImpactsByBearer}
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la collectivité locale"
        total={indirectEconomicImpactsByBearer.local_authority.total}
        chart={
          <LocalAuthorityIndirectEconomicImpactsCharts
            localAuthorityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.local_authority}
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour les riverains"
        total={indirectEconomicImpactsByBearer.local_people_or_company.total}
        chart={
          <LocalPeopleOrCompanyIndirectEconomicImpactsCharts
            localAuthorityIndirectEconomicImpacts={
              indirectEconomicImpactsByBearer.local_people_or_company
            }
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la société française et mondiale"
        total={indirectEconomicImpactsByBearer.humanity.total}
        chart={
          <HumanityIndirectEconomicImpactsCharts
            localAuthorityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.humanity}
          />
        }
      />
    </div>
  );
}
