import { ReinstatementExpense } from "shared";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteSoilsDistribution } from "@/features/create-project/core/createProject.selectors";
import { selectProjectSoilsDistribution } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { reinstatementExpensesCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectCreationData } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import ReinstatementsExpensesForm from "@/features/create-project/views/common-views/expenses/reinstatement";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();

  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilsDistribution);
  const projectData = useAppSelector(selectCreationData);
  const preEnteredData = projectData.reinstatementExpenses;

  return (
    <ReinstatementsExpensesForm
      preEnteredData={preEnteredData}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      decontaminatedSurfaceArea={projectData.decontaminatedSurfaceArea ?? 0}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(expenses: ReinstatementExpense[]) => {
        dispatch(reinstatementExpensesCompleted(expenses));
      }}
    />
  );
}

export default ReinstatementExpensesFormContainer;
