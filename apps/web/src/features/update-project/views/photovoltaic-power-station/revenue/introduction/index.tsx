import { useAppDispatch } from "@/app/hooks/store.hooks";
import ProjectRevenueIntroduction from "@/features/create-project/views/photovoltaic-power-station/revenue/introduction/ProjectRevenueIntroduction";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested());
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
