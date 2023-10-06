import NaturalAreaYearlyOperationExpensesForm from "./NaturalAreaYearlyOperationExpensesForm";
import { buildViewModel } from "./naturalAreaYearlyOperationExpensesFormViewModel";

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function NaturalAreaYearlyOperationExpensesFormController() {
  const dispatch = useAppDispatch();
  const naturalAreaData = useAppSelector(
    (state) => state.naturalAreaCreation.naturalAreaData,
  );
  const viewModel = buildViewModel(dispatch, naturalAreaData);

  return <NaturalAreaYearlyOperationExpensesForm {...viewModel} />;
}

export default NaturalAreaYearlyOperationExpensesFormController;
