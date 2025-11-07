import { SiteNature } from "shared";

import { setInitialParams } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import DownloadImpactsCard from "./DownloadImpactsCard";
import FurtherActionsSection from "./FutherActionsSection";
import FricheComparisonSectionCard from "./compare-impacts/FricheCard";
import NonFricheComparisonSectionCard from "./compare-impacts/NonFricheCard";

type Props = {
  siteId: string;
  siteNature: SiteNature;
  projectId: string;
  evaluationPeriod?: number;
  isUpdateEnabled: boolean;
};

function ProjectImpactFooter({
  siteId,
  siteNature,
  projectId,
  evaluationPeriod,
  isUpdateEnabled,
}: Props) {
  const dispatch = useAppDispatch();

  const onSelectOption = (comparisonSiteNature: SiteNature) => {
    dispatch(setInitialParams({ evaluationPeriod, comparisonSiteNature }));
    routes.urbanSprawlImpactsComparison({ projectId, page: "introduction" }).push();
  };

  if (siteNature === "FRICHE") {
    return (
      <>
        <div className="grid md:grid-cols-2 gap-x-6">
          <DownloadImpactsCard />
          <FricheComparisonSectionCard onSelectOption={onSelectOption} />
        </div>

        <FurtherActionsSection
          siteId={siteId}
          projectId={projectId}
          isUpdateEnabled={isUpdateEnabled}
        />
      </>
    );
  }

  return (
    <>
      <NonFricheComparisonSectionCard siteNature={siteNature} onSelectOption={onSelectOption} />
      <FurtherActionsSection
        siteId={siteId}
        projectId={projectId}
        isUpdateEnabled={isUpdateEnabled}
      />
    </>
  );
}

export default ProjectImpactFooter;
