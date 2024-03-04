import HasRealEstateTransactionForm, { FormValues } from "./HasRealEstateTransactionForm";

import {
  completeHasRealEstateTransaction,
  revertHasRealEstateTransaction,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function HasRealEstateTransactionFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.projectCreation.siteData?.owner);

  const onSubmit = (data: FormValues) => {
    const hasRealEstateTransaction = data.hasRealEstateTransaction === "yes";
    dispatch(completeHasRealEstateTransaction(hasRealEstateTransaction));
  };

  const onBack = () => {
    dispatch(revertHasRealEstateTransaction());
  };

  return (
    <HasRealEstateTransactionForm
      onSubmit={onSubmit}
      onBack={onBack}
      currentOwnerName={siteOwner?.name}
    />
  );
}

export default HasRealEstateTransactionFormContainer;
