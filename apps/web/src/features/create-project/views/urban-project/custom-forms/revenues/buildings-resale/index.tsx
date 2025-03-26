import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { buildingsResaleRevenueCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSiteResaleAmounts } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsResaleRevenueForm from "./BuildingsResaleRevenueForm";

function BuildingsResaleRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectSiteResaleAmounts);

  return (
    <BuildingsResaleRevenueForm
      initialValues={initialValues}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={({ sellingPrice, propertyTransferDuties }) => {
        dispatch(buildingsResaleRevenueCompleted({ sellingPrice, propertyTransferDuties }));
      }}
    />
  );
}

export default BuildingsResaleRevenueFormContainer;
