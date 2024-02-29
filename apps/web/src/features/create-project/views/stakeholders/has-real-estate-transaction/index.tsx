import HasRealEstateTransactionForm, { FormValues } from "./HasRealEstateTransactionForm";

import { completeHasRealEstateTransaction } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function HasRealEstateTransactionFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.projectCreation.siteData?.owner);

  const onSubmit = (data: FormValues) => {
    const hasRealEstateTransaction = data.hasRealEstateTransaction === "yes";
    dispatch(completeHasRealEstateTransaction(hasRealEstateTransaction));
  };

  return <HasRealEstateTransactionForm onSubmit={onSubmit} currentOwnerName={siteOwner?.name} />;
}

export default HasRealEstateTransactionFormContainer;
