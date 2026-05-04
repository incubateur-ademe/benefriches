import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { BreakEvenLevelTabDataView } from "../../application/project-impacts/projectBreakEvenLevel.selectors";
import { selectImpactsPageViewData } from "../../core/projectImpacts.selectors";
import ProjectPageHeader from "../project-page/header/";
import { formatMonetaryImpact } from "../shared/formatImpactValue";
import BreakEvenLevalImpactsActionBar from "./ProjectBreakEvenLevelActionBar";
import ProjectBreakEvenLevelSummary from "./ProjectBreakEvenLevelSummary";
import BreakEvenLevelChart from "./charts/BreakEvenLevelChart";
import EconomicBalanceChart from "./charts/EconomicBalanceChart";
import IndirectEconomicImpactsChart from "./charts/IndirectEconomicImpactsChart";

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
      <div className="grid grid-cols-8 gap-8">
        <div className="col-span-2">
          <span
            className={classNames(
              `fr-badge`,
              "text-[32px]",
              "px-3",
              "py-4",
              "mb-4",
              getPositiveNegativeTextClassesFromValue(economicBalance.total),
            )}
          >
            {formatMonetaryImpact(economicBalance.total)}
          </span>
          <h4 className="mb-4">
            Bilan de l'opération {economicBalance.total > 0 ? "positif" : "négatif"}
          </h4>
          <p>Pour l'aménageur.</p>
        </div>

        <div className="col-start-3 col-span-6">
          <EconomicBalanceChart economicBalance={economicBalance} />
        </div>
      </div>

      <div className="grid grid-cols-8 gap-8">
        <div className="col-span-2">
          <span
            className={classNames(
              `fr-badge`,
              "text-[32px]",
              "px-3",
              "py-4",
              "mb-4",
              getPositiveNegativeTextClassesFromValue(indirectEconomicImpacts.total),
            )}
          >
            {formatMonetaryImpact(indirectEconomicImpacts.total)}
          </span>

          <h4 className="mb-4">
            Impacts socio-économiques {indirectEconomicImpacts.total > 0 ? "positifs" : "négatifs"}
          </h4>
          <p>Pour la collectivité locale, les riverains, la société fançaise et mondiale.</p>
        </div>

        <div className="col-start-3 col-span-6">
          <IndirectEconomicImpactsChart
            indirectEconomicImpactsTotal={indirectEconomicImpacts.total}
            indirectEconomicImpactsByBearer={indirectEconomicImpactsByBearer}
          />
        </div>
      </div>
    </div>
  );
}
