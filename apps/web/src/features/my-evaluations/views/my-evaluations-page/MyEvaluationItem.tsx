import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MutabilityUsage } from "shared";

import { formatPercentage } from "@/shared/core/format-number/formatNumber";
import { getMutabilityUsageDisplayName } from "@/shared/core/reconversionCompatibility";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import NewProjectTile from "@/shared/views/components/ProjectTile/NewProjectTile";
import ProjectOverviewTile from "@/shared/views/components/ProjectTile/ProjectOverviewTile";
import ProjectTile from "@/shared/views/components/ProjectTile/ProjectTile";
import { routes } from "@/shared/views/router";

import { UserSiteEvaluation } from "../../domain/types";

type Props = {
  evaluation: UserSiteEvaluation;
  onRemoveProjectFromList: (props: { siteId: string; projectId: string }) => void;
};

const TILE_CLASSNAME = "w-[216px]";

const barChartOptions: Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  chart: {
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    spacingTop: 0,
    width: 375,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: false,
      },
      colorByPoint: true,
    },
  },
  legend: {
    enabled: false,
  },
});

function MyEvaluationItem({ evaluation, onRemoveProjectFromList }: Props) {
  const { siteName, siteId, reconversionProjects, compatibilityEvaluation, isExpressSite } =
    evaluation;

  const projectLimit = compatibilityEvaluation ? 1 : 3;

  const nbOtherProjects = evaluation.reconversionProjects.total - projectLimit;

  return (
    <div className="rounded-2xl">
      <div className="rounded-t-2xl bg-(--background-alt-grey) p-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-4">
          <a {...routes.siteActionsList({ siteId }).link} className="bg-none">
            <h2 className="mb-0 text-2xl">{siteName}</h2>
          </a>
          {isExpressSite && (
            <Badge small style="blue">
              Site express
            </Badge>
          )}
        </div>

        <a {...routes.siteFeatures({ siteId }).link}>Voir toutes les données du site</a>
      </div>
      <div className="rounded-b-2xl bg-(--background-default-grey) flex flex-wrap">
        {compatibilityEvaluation && (
          <div className="flex flex-col border-r p-8">
            <h3 className="text-xl">Résultat de compatibilité</h3>
            <HighchartsReact
              highcharts={Highcharts}
              options={
                {
                  ...barChartOptions,
                  xAxis: {
                    categories: compatibilityEvaluation.top3Usages.map(({ usage }) => usage),
                    labels: {
                      useHTML: true,
                      formatter: function () {
                        return `<span title="${getMutabilityUsageDisplayName(this.value as MutabilityUsage)}"><strong class="line-clamp-1">${getMutabilityUsageDisplayName(this.value as MutabilityUsage)}</strong>${formatPercentage(compatibilityEvaluation.top3Usages[this.pos]?.score ?? 0)}</span>`;
                      },
                    },
                  },
                  series: [
                    {
                      type: "column",
                      name: "Montant (en €)",
                      data: compatibilityEvaluation.top3Usages.map(({ usage, score }) => ({
                        name: usage,
                        y: score,
                      })),
                    },
                  ],
                } as Highcharts.Options
              }
            />
          </div>
        )}
        <div className="p-8 flex flex-col">
          <h3 className="text-xl">Projets évalués</h3>
          <div className="flex flex-wrap gap-3 m-auto">
            {reconversionProjects.lastProjects
              .slice(0, projectLimit)
              .map(({ projectType, name, id, isExpressProject }) => (
                <ProjectOverviewTile
                  from="evaluations"
                  projectType={projectType}
                  projectName={name}
                  siteName={siteName}
                  id={id}
                  isExpressProject={isExpressProject}
                  key={id}
                  className={TILE_CLASSNAME}
                  onSuccessArchive={() => {
                    onRemoveProjectFromList({ projectId: id, siteId });
                  }}
                />
              ))}
            {nbOtherProjects > 0 && (
              <ProjectTile
                className={classNames("justify-center", TILE_CLASSNAME)}
                linkProps={routes.siteEvaluatedProjects({ siteId }).link}
              >
                <h4 className="text-lg mb-0 text-center flex flex-col">
                  {nbOtherProjects > 1 ? (
                    <>
                      <span className="text-[40px]">{nbOtherProjects}</span>
                      autres projets
                    </>
                  ) : (
                    <>
                      <span className="text-[40px]">1</span>
                      autre projet
                    </>
                  )}
                </h4>
              </ProjectTile>
            )}

            <NewProjectTile className={TILE_CLASSNAME} siteId={evaluation.siteId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvaluationItem;
