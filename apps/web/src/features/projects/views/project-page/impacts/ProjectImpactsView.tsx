import { ViewMode } from "../../../application/project-impacts/projectImpacts.reducer";
import ImpactsChartsView from "./charts-view";
import ImpactsListViewContainer from "./list-view";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  currentViewMode: ViewMode;
};

const ProjectImpactsView = ({ currentViewMode }: Props) => {
  return (
    <>
      {currentViewMode === "summary" && <ImpactsSummaryViewContainer />}
      {currentViewMode === "list" && <ImpactsListViewContainer />}
      {currentViewMode === "charts" && <ImpactsChartsView />}
    </>
  );
};

export default ProjectImpactsView;
