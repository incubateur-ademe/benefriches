import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ProjectSoilsSummary from "@/features/create-project/views/photovoltaic-power-station/soils/soils-summary/ProjectSoilsSummary";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVSoilsSummaryViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => {
    dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested());
  };
  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
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
