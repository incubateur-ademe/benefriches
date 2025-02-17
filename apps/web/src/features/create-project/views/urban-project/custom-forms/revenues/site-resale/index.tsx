import {
  expectedSiteResaleRevenueCompleted,
  expectedSiteResaleRevenueReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSiteResaleAmounts } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteResaleRevenueForm from "./SiteResaleRevenueForm";

function SiteResaleRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectSiteResaleAmounts);

  return (
    <SiteResaleRevenueForm
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

export default SiteResaleRevenueFormContainer;
