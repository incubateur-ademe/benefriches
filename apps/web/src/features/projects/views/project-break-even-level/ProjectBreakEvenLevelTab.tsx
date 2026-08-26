import { useContext } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";

import { BreakEvenLevelTabDataView } from "../../application/project-impacts/selectors/projectBreakEvenLevel.selectors";
import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import { ImpactModalDescriptionContext } from "../impact-description-modals/ImpactModalDescriptionContext";
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

type Props = BreakEvenLevelTabDataView & {
  projectId: string;
  onEvaluationPeriodChange: (value: number) => void;
};

export default function ProjectBreakEvenLevelTab({
  projectId,
  impacts,
  indirectEconomicImpactsByBearer,
  projectEconomicBalanceByCategory,
  onEvaluationPeriodChange,
}: Props) {
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);
  const { projectionYears, aggregatedReconversionImpacts } = impacts;
  const {
    breakEvenYear,
    cumulativeBalanceByYear,
    cumulativeEconomicBalanceByYear,
    cumulativeIndirectEconomicImpactsByYear,
    indirectEconomicImpacts,
  } = aggregatedReconversionImpacts;

  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl mb-0">Analyse coût-bénéfice</h3>
        <BreakEvenLevalImpactsActionBar
          evaluationPeriod={evaluationPeriod}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ProjectPageHeader projectId={projectId} />}
        />
      </div>

      <div className="grid md:grid-cols-8 gap-8">
        <div className="md:col-span-2">
          <ProjectBreakEvenLevelSummary
            breakEvenYear={breakEvenYear}
            projectionYears={projectionYears}
          />
        </div>

        <div className="md:col-start-3 md:col-span-6 highcharts-no-xaxis">
          <BreakEvenLevelChart
            linkProps={getDetailsLink({ sectionName: "breakEvenLevel" })}
            cumulativeBalanceByYear={cumulativeBalanceByYear}
            cumulativeEconomicBalanceByYear={cumulativeEconomicBalanceByYear}
            cumulativeIndirectEconomicImpactsByYear={cumulativeIndirectEconomicImpactsByYear}
            projectionYears={projectionYears}
            breakEvenIndex={breakEvenIndex}
            breakEvenYear={breakEvenYear}
          />
        </div>
      </div>

      <ProjectBreakEvenLevelSection
        title={`Bilan de l'opération ${projectEconomicBalanceByCategory.total > 0 ? "positif" : "négatif"}`}
        subtitle="Pour l'aménageur."
        total={projectEconomicBalanceByCategory.total}
        chart={
          <EconomicBalanceChart
            linkProps={getDetailsLink({ sectionName: "economicBalance" })}
            projectEconomicBalanceByCategory={projectEconomicBalanceByCategory}
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title={`Impacts socio-économiques ${indirectEconomicImpacts.total > 0 ? "positifs" : "négatifs"}`}
        subtitle="Pour la collectivité locale, les riverains, la société fançaise et mondiale."
        total={indirectEconomicImpacts.total}
        chart={
          <IndirectEconomicImpactsChart
            linkProps={getDetailsLink({ sectionName: "socioEconomic" })}
            indirectEconomicImpactsTotal={indirectEconomicImpacts.total}
            indirectEconomicImpactsTotalByBearer={{
              humanity: indirectEconomicImpactsByBearer.humanity.total,
              localAuthority: indirectEconomicImpactsByBearer.localAuthority.total,
              localPeopleOrCompany: indirectEconomicImpactsByBearer.localPeopleOrCompany.total,
            }}
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la collectivité locale"
        total={indirectEconomicImpactsByBearer.localAuthority.total}
        chart={
          <LocalAuthorityIndirectEconomicImpactsCharts
            linkProps={getDetailsLink({ sectionName: "socioEconomic.localAuthority" })}
            localAuthorityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.localAuthority}
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour les riverains"
        total={indirectEconomicImpactsByBearer.localPeopleOrCompany.total}
        chart={
          <LocalPeopleOrCompanyIndirectEconomicImpactsCharts
            linkProps={getDetailsLink({ sectionName: "socioEconomic.localPeopleOrCompany" })}
            localPeopleOrCompanyIndirectEconomicImpacts={
              indirectEconomicImpactsByBearer.localPeopleOrCompany
            }
          />
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la société française et mondiale"
        total={indirectEconomicImpactsByBearer.humanity.total}
        chart={
          <HumanityIndirectEconomicImpactsCharts
            linkProps={getDetailsLink({ sectionName: "socioEconomic.humanity" })}
            humanityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.humanity}
          />
        }
      />
    </div>
  );
}
