import { useAppSelector } from "@/app/hooks/store.hooks";

import { BreakEvenLevelTabDataView } from "../../application/project-impacts/selectors/projectBreakEvenLevel.selectors";
import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import ProjectPageHeader from "../project-page/header/";
import ImpactModalDescription from "../project-page/impacts/impact-description-modals/ImpactModalDescription";
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
  contextData,
  indirectEconomicImpactsByBearer,
  onEvaluationPeriodChange,
}: Props) {
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);
  const { projectionYears, projectEconomicBalance, aggregatedReconversionImpacts } = impacts;
  const { breakEvenYear, cumulativeBalanceByYear, indirectEconomicImpacts } =
    aggregatedReconversionImpacts;

  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

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
            dialogId={`fr-modal-impacts-break-even-level-tab-breakEvenLevel--Chart`}
            values={cumulativeBalanceByYear}
            xValues={projectionYears}
            breakEvenIndex={breakEvenIndex}
            breakEvenYear={breakEvenYear}
          />
          <ImpactModalDescription
            dialogId={`fr-modal-impacts-break-even-level-tab-breakEvenLevel--Chart`}
            initialState={{
              sectionName: "breakEvenLevel",
            }}
            contextData={contextData}
            impactsData={impacts}
          />
        </div>
      </div>

      <ProjectBreakEvenLevelSection
        title={`Bilan de l'opération ${projectEconomicBalance.total > 0 ? "positif" : "négatif"}`}
        subtitle="Pour l'aménageur."
        total={projectEconomicBalance.total}
        chart={
          <>
            <EconomicBalanceChart
              dialogId="fr-modal-impacts-break-even-level-tab-economicBalance--Chart"
              projectEconomicBalance={projectEconomicBalance}
            />
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-break-even-level-tab-economicBalance--Chart`}
              initialState={{
                sectionName: "economic_balance",
              }}
              contextData={contextData}
              impactsData={impacts}
            />
          </>
        }
      />

      <ProjectBreakEvenLevelSection
        title={`Impacts socio-économiques ${indirectEconomicImpacts.total > 0 ? "positifs" : "négatifs"}`}
        subtitle="Pour la collectivité locale, les riverains, la société fançaise et mondiale."
        total={indirectEconomicImpacts.total}
        chart={
          <>
            <IndirectEconomicImpactsChart
              dialogId={`fr-modal-impacts-break-even-level-tab-socioEconomic--Chart`}
              indirectEconomicImpactsTotal={indirectEconomicImpacts.total}
              indirectEconomicImpactsTotalByBearer={{
                humanity: indirectEconomicImpactsByBearer.humanity.total,
                localAuthority: indirectEconomicImpactsByBearer.localAuthority.total,
                localPeopleOrCompany: indirectEconomicImpactsByBearer.localPeopleOrCompany.total,
              }}
            />
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-break-even-level-tab-socioEconomic--Chart`}
              initialState={{
                sectionName: "socio_economic",
              }}
              contextData={contextData}
              impactsData={impacts}
            />
          </>
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la collectivité locale"
        total={indirectEconomicImpactsByBearer.localAuthority.total}
        chart={
          <>
            <LocalAuthorityIndirectEconomicImpactsCharts
              dialogId={`fr-modal-impacts-break-even-level-tab-localAuthority--Chart`}
              localAuthorityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.localAuthority}
            />
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-break-even-level-tab-localAuthority--Chart`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: "localAuthority",
              }}
              contextData={contextData}
              impactsData={impacts}
            />
          </>
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour les riverains"
        total={indirectEconomicImpactsByBearer.localPeopleOrCompany.total}
        chart={
          <>
            <LocalPeopleOrCompanyIndirectEconomicImpactsCharts
              dialogId={`fr-modal-impacts-break-even-level-tab-localPeopleOrCompany--Chart`}
              localPeopleOrCompanyIndirectEconomicImpacts={
                indirectEconomicImpactsByBearer.localPeopleOrCompany
              }
            />
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-break-even-level-tab-localPeopleOrCompany--Chart`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: "localPeopleOrCompany",
              }}
              contextData={contextData}
              impactsData={impacts}
            />
          </>
        }
      />

      <ProjectBreakEvenLevelSection
        title="pour la société française et mondiale"
        total={indirectEconomicImpactsByBearer.humanity.total}
        chart={
          <>
            <HumanityIndirectEconomicImpactsCharts
              dialogId={`fr-modal-impacts-break-even-level-tab-humanity--Chart`}
              humanityIndirectEconomicImpacts={indirectEconomicImpactsByBearer.humanity}
            />
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-break-even-level-tab-humanity--Chart`}
              initialState={{
                sectionName: "socio_economic",
                subSectionName: "humanity",
              }}
              contextData={contextData}
              impactsData={impacts}
            />
          </>
        }
      />
    </div>
  );
}
