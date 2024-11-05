import { ReinstatementExpense } from "shared";

import { selectSiteSoilsDistribution } from "@/features/create-project/application/createProject.selectors";
import { selectProjectSoilsDistribution } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import {
  reinstatementExpensesCompleted,
  reinstatementExpensesReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectCreationData } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import ReinstatementsExpensesForm from "@/features/create-project/views/common-views/costs/reinstatement-costs";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();

  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilsDistribution);
  const projectData = useAppSelector(selectCreationData);

  return (
    <ReinstatementsExpensesForm
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      decontaminatedSurfaceArea={projectData.decontaminatedSurfaceArea ?? 0}
      onBack={() => {
        dispatch(reinstatementExpensesReverted());
      }}
      onSubmit={(expenses: ReinstatementExpense[]) => {
        dispatch(reinstatementExpensesCompleted(expenses));
      }}
    />
  );
}

export default ReinstatementExpensesFormContainer;
