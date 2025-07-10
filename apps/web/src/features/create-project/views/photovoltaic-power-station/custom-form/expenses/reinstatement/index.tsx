import { ReinstatementExpense } from "shared";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteData } from "@/features/create-project/core/createProject.selectors";
import { completeReinstatementExpenses } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ReinstatementsExpensesForm from "../../../../common-views/expenses/reinstatement";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();

  const siteData = useAppSelector(selectSiteData);
  const projectData = useAppSelector(selectCreationData);
  const initialValues = projectData.reinstatementExpenses;

  return (
    <ReinstatementsExpensesForm
      preEnteredData={initialValues}
      siteSoilsDistribution={siteData?.soilsDistribution ?? {}}
      projectSoilsDistribution={projectData.soilsDistribution ?? {}}
      decontaminatedSurfaceArea={projectData.decontaminatedSurfaceArea ?? 0}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(expenses: ReinstatementExpense[]) => {
        dispatch(completeReinstatementExpenses(expenses));
      }}
    />
  );
}

export default ReinstatementExpensesFormContainer;
