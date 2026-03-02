import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsSummaryStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVSoilsSummaryViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";

import ProjectSoilsSummary from "./ProjectSoilsSummary";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => {
    dispatch(completeSoilsSummaryStep());
  };
  const onBack = () => {
    dispatch(stepReverted());
  };
  const { siteSoilsDistribution, projectSoilsDistribution } = useAppSelector(
    selectPVSoilsSummaryViewData,
  );

  return (
    <ProjectSoilsSummary
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ProjectSoilsSummaryContainer;
