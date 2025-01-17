import {
  expectedSiteResaleRevenueCompleted,
  expectedSiteResaleRevenueReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSiteResaleAmounts } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ExpectedSiteResaleForm from "./ExpectedSiteResaleForm";

function ExpectedResaleFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectSiteResaleAmounts);

  return (
    <ExpectedSiteResaleForm
      initialValues={initialValues}
      onBack={() => {
        dispatch(expectedSiteResaleRevenueReverted());
      }}
      onSubmit={({ sellingPrice, propertyTransferDuties }) => {
        dispatch(expectedSiteResaleRevenueCompleted({ sellingPrice, propertyTransferDuties }));
      }}
    />
  );
}

export default ExpectedResaleFormContainer;
