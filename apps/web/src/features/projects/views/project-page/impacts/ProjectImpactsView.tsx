import { ViewMode } from "../../../application/projectImpacts.reducer";
import ImpactsChartsView from "./charts-view";
import ImpactModalDescriptionProviderContainer from "./impact-description-modals";
import ImpactsListViewContainer from "./list-view";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  currentViewMode: ViewMode;
};

const ProjectImpactsView = ({ currentViewMode }: Props) => {
  return (
    <ImpactModalDescriptionProviderContainer>
      <>
        {currentViewMode === "summary" && <ImpactsSummaryViewContainer />}
        {currentViewMode === "list" && <ImpactsListViewContainer />}
        {currentViewMode === "charts" && <ImpactsChartsView />}
      </>
    </ImpactModalDescriptionProviderContainer>
  );
};

export default ProjectImpactsView;
