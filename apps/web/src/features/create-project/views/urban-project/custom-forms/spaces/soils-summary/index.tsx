import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteSoilsDistribution } from "@/features/create-project/core/createProject.selectors";
import { soilsSummaryCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectUrbanProjectSoilsDistribution } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
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
        dispatch(stepRevertAttempted());
      }}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
    />
  );
}

export default UrbanProjectSoilsSummaryContainer;
