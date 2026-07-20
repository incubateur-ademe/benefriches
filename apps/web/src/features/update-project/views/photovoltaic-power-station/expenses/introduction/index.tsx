import { useAppDispatch } from "@/app/hooks/store.hooks";
import ProjectExpensesIntroduction from "@/features/create-project/views/photovoltaic-power-station/expenses/introduction/ProjectExpensesIntroduction";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested());
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
