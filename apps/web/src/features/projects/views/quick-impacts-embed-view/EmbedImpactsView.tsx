import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";

import classNames from "@/shared/views/clsx";

import { ViewMode } from "../../application/projectImpacts.reducer";
import ImpactsChartsView from "../project-page/impacts/charts-view";
import ImpactModalDescriptionProviderContainer from "../project-page/impacts/impact-description-modals";
import ImpactsListViewContainer from "../project-page/impacts/list-view";
import ImpactsSummaryViewContainer from "../project-page/impacts/summary-view";
import ImpactsActionBar from "../shared/actions/ActionBar";
import QuickImpactsCallout from "./Callout";
import QuickImpactsTitle from "./Title";

type Props = {
  evaluationPeriod: number;
  currentViewMode: ViewMode;
  onCurrentViewModeChange: (v: ViewMode) => void;
  siteCity: string;
  siteSurfaceArea: number;
};

export default function QuickImpactsEmbedView({
  currentViewMode,
  evaluationPeriod,
  onCurrentViewModeChange,
  siteCity,
  siteSurfaceArea,
}: Props) {
  const { isDark } = useIsDark();

  return (
    <div
      className={classNames(
        "tw-px-4 tw-py-6",
        "tw-bg-grey-light dark:tw-bg-grey-dark",
        "tw-h-full",
        // Force highchart à suivre la config dsfr pour le dark mode,
        // sinon la lib suit la config du navigateur "prefers-color-scheme"
        isDark ? "highcharts-dark" : "highcharts-light",
      )}
    >
      <QuickImpactsTitle siteCity={siteCity} />
      <QuickImpactsCallout
        evaluationPeriod={evaluationPeriod}
        siteCity={siteCity}
        siteSurfaceArea={siteSurfaceArea}
      />
      <ImpactsActionBar
        small
        evaluationPeriod={evaluationPeriod}
        onEvaluationPeriodChange={() => null}
        onViewModeClick={onCurrentViewModeChange}
        selectedViewMode={currentViewMode}
      />
      <ImpactModalDescriptionProviderContainer>
        {currentViewMode === "summary" && <ImpactsSummaryViewContainer />}
        {currentViewMode === "list" && <ImpactsListViewContainer />}
        {currentViewMode === "charts" && <ImpactsChartsView />}
      </ImpactModalDescriptionProviderContainer>
    </div>
  );
}
