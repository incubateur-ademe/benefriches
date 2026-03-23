import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { mutabilityOrImpactsSelectionCompleted } from "@/features/create-site/core/steps/introduction/introduction.actions";

import UseMutabilityForm from "./UseMutabilityForm";

function UseMutabilityFormContainer() {
  const dispatch = useAppDispatch();
  const useMutability = useAppSelector((state) => state.siteCreation.useMutability);

  return (
    <UseMutabilityForm
      initialValues={{ useMutability: useMutability === false ? "no" : undefined }}
      onSubmit={({ useMutability }) => {
        dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: useMutability === "yes" }));
        if (useMutability === "yes") {
          routes.evaluateReconversionCompatibility().push();
          return;
        }
      }}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default UseMutabilityFormContainer;
