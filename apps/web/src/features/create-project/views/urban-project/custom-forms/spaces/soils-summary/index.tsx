import { selectSiteSoilsDistribution } from "@/features/create-project/application/createProject.selectors";
import {
  soilsSummaryCompleted,
  soilsSummaryReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectUrbanProjectSoilsDistribution } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectSoilsSummary from "./UrbanProjectSoilsSummary";

function UrbanProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectUrbanProjectSoilsDistribution);

  return (
    <UrbanProjectSoilsSummary
      onNext={() => dispatch(soilsSummaryCompleted())}
      onBack={() => {
        dispatch(soilsSummaryReverted());
      }}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
    />
  );
}

export default UrbanProjectSoilsSummaryContainer;
