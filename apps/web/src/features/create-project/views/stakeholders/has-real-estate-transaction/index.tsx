import HasRealEstateTransactionForm, { FormValues } from "./HasRealEstateTransactionForm";

import {
  goToStep,
  ProjectCreationStep,
  setHasRealEstateTransaction,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function HasRealEstateTransactionFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.projectCreation.siteData?.owner);

  const onSubmit = (data: FormValues) => {
    const hasRealEstateTransaction = data.hasRealEstateTransaction === "yes";
    dispatch(setHasRealEstateTransaction(hasRealEstateTransaction));
    const nextStep = hasRealEstateTransaction
      ? ProjectCreationStep.STAKEHOLDERS_FUTURE_SITE_OWNER
      : ProjectCreationStep.COSTS_INTRODUCTION;
    dispatch(goToStep(nextStep));
  };

  return <HasRealEstateTransactionForm onSubmit={onSubmit} currentOwnerName={siteOwner?.name} />;
}

export default HasRealEstateTransactionFormContainer;
