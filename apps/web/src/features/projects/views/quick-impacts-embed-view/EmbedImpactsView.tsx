import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import type { Link, Route } from "type-route";

import type { embedRoutes } from "@/embed";
import classNames from "@/shared/views/clsx";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ProjectDevelopmentScore from "../project-development-score/ProjectDevelopmentScorePage";
import QuickImpactsCallout from "./Callout";
import QuickImpactsTitle from "./Title";

type Props = Route<typeof embedRoutes.routes.quickImpactsUrbanProject>["params"] &
  DevelopmentScoreDataView & {
    evaluationPeriod: number;
    getUpdateRouteDetailsFn: (details?: string) => {
      link: Link;
      push: () => void;
    };
  };

export default function QuickImpactsEmbedView({
  siteSurfaceArea,
  evaluationPeriod,
  developmentScore,
  modalsData,
  details: routeParamsDetails,
  getUpdateRouteDetailsFn,
}: Props) {
  const { isDark } = useIsDark();

  return (
    <div
      className={classNames(
        "px-4 py-6",
        "bg-grey-light dark:bg-grey-dark",
        "h-full",
        // Force highchart à suivre la config dsfr pour le dark mode,
        // sinon la lib suit la config du navigateur "prefers-color-scheme"
        isDark ? "highcharts-dark" : "highcharts-light",
      )}
    >
      <QuickImpactsTitle siteCity={modalsData.contextData.siteAddress.label} />
      <QuickImpactsCallout
        evaluationPeriod={evaluationPeriod}
        siteCity={modalsData.contextData.siteAddress.label}
        siteSurfaceArea={siteSurfaceArea}
      />
      <ProjectDevelopmentScore
        developmentScore={developmentScore}
        modalsData={modalsData}
        routeParamsDetails={routeParamsDetails}
        getUpdateRouteDetailsFn={getUpdateRouteDetailsFn}
        projectId={modalsData.contextData.projectId}
        disableExport
        disableStickyHeader
      />
    </div>
  );
}
