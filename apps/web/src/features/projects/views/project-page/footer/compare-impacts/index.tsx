import { setInitialParams } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import ImpactComparisonSection from "./ImpactComparisonSection";

type Props = {
  projectId: string;
  evaluationPeriod?: number;
};
const ImpactComparisonSectionContainer = ({ projectId, evaluationPeriod }: Props) => {
  const siteNature = useAppSelector((state) => state.projectImpacts.relatedSiteData?.nature);

  const dispatch = useAppDispatch();

  return (
    <ImpactComparisonSection
      siteNature={siteNature!}
      onSelectOption={(comparisonSiteNature) => {
        dispatch(setInitialParams({ evaluationPeriod, comparisonSiteNature }));
        routes.urbanSprawlImpactsComparison({ projectId, page: "introduction" }).push();
      }}
    />
  );
};

export default ImpactComparisonSectionContainer;
