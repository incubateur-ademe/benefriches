import NaturalAreaYearlyOperationIncomeForm from "./NaturalAreaYearlyOperationIncomeForm";
import { buildViewModel } from "./naturalAreaYearlyOperationIncomeFormViewModel";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function NaturalAreaYearlyOperationIncomeFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <NaturalAreaYearlyOperationIncomeForm {...viewModel} />;
}

export default NaturalAreaYearlyOperationIncomeFormController;
