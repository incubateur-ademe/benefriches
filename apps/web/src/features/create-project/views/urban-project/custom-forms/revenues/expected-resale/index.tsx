import {
  expectedSiteResaleRevenueCompleted,
  expectedSiteResaleRevenueReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ExpectedSiteResaleForm from "./ExpectedSiteResaleForm";

function ExpectedResaleFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ExpectedSiteResaleForm
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
