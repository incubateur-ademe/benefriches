import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { ViewMode } from "../../../application/project-impacts/projectImpacts.reducer";
import ImpactsChartsView from "./charts-view";
import ImpactsListViewContainer from "./list-view";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  currentViewMode: ViewMode;
  projectName: string;
};

const ProjectImpactsView = ({ currentViewMode, projectName }: Props) => {
  return (
    <>
      {currentViewMode === "summary" && (
        <>
          <HtmlTitle>{`Synthèse - ${projectName} - Impacts`}</HtmlTitle>
          <ImpactsSummaryViewContainer />
        </>
      )}
      {currentViewMode === "list" && (
        <>
          <HtmlTitle>{`Liste - $projectName} - Impacts`}</HtmlTitle>
          <ImpactsListViewContainer />
        </>
      )}
      {currentViewMode === "charts" && (
        <>
          <HtmlTitle>{`Graphique - ${projectName} - Impacts`}</HtmlTitle>
          <ImpactsChartsView />
        </>
      )}
    </>
  );
};

export default ProjectImpactsView;
