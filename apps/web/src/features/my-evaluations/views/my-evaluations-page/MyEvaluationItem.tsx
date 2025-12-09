import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MutabilityUsage } from "shared";

import { getScenarioPictoUrl } from "@/features/projects/views/shared/scenarioType";
import { formatPercentage } from "@/shared/core/format-number/formatNumber";
import { getMutabilityUsageDisplayName } from "@/shared/core/reconversionCompatibility";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import Badge from "@/shared/views/components/Badge/Badge";
import { routes } from "@/shared/views/router";

import { UserSiteEvaluation } from "../../domain/types";
import MyEvaluationsProjectLinkTile from "./MyEvaluationsProjectLinkTile";

type Props = {
  evaluation: UserSiteEvaluation;
};

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

function MyEvaluationItem({ evaluation }: Props) {
  const { siteName, siteId, reconversionProjects, compatibilityEvaluation, isExpressSite } =
    evaluation;

  const projectLimit = compatibilityEvaluation ? 2 : 4;

  const nbOtherProjects = evaluation.reconversionProjects.total - projectLimit;

  return (
    <div className="rounded-2xl">
      <div className="rounded-t-2xl bg-(--background-alt-grey) p-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="mb-0 text-2xl">{siteName}</h2>
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
          <div className="flex flex-col border-r p-10">
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
        <div className="p-10 flex flex-col">
          <h3 className="text-xl">Projets évalués</h3>
          <div className="flex flex-wrap gap-4 m-auto">
            {reconversionProjects.lastProjects
              .slice(0, projectLimit - 1)
              .map(({ projectType, name, id, isExpressProject }) => (
                <MyEvaluationsProjectLinkTile
                  key={id}
                  justify="start"
                  linkProps={
                    routes.projectImpacts({
                      projectId: id,
                    }).link
                  }
                >
                  <img
                    className="fr-responsive-img w-20"
                    src={getScenarioPictoUrl(projectType)}
                    aria-hidden={true}
                    alt=""
                    width="80px"
                    height="80px"
                  />
                  <h4 className="text-lg mb-0 text-center flex flex-col items-center">
                    {name}
                    {isExpressProject && (
                      <Badge small className="mt-2" style="blue">
                        Projet express
                      </Badge>
                    )}
                  </h4>
                </MyEvaluationsProjectLinkTile>
              ))}
            {nbOtherProjects > 0 && (
              <MyEvaluationsProjectLinkTile
                justify="center"
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
              </MyEvaluationsProjectLinkTile>
            )}

            <MyEvaluationsProjectLinkTile
              linkProps={routes.createProject({ siteId: evaluation.siteId }).link}
              border="dashed"
              className="text-dsfr-title-blue text-lg"
            >
              <span aria-hidden="true" className={fr.cx("fr-icon--lg", "fr-icon-add-line")} />
              Évaluer un nouveau projet sur ce site
            </MyEvaluationsProjectLinkTile>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvaluationItem;
