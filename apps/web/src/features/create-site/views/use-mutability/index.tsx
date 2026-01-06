import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { useMutabilityCompleted } from "../../core/actions/introduction.actions";
import { stepReverted } from "../../core/actions/revert.action";
import UseMutabilityForm from "./UseMutabilityForm";

function UseMutabilityFormContainer() {
  const dispatch = useAppDispatch();
  const useMutability = useAppSelector((state) => state.siteCreation.useMutability);

  return (
    <UseMutabilityForm
      initialValues={{ useMutability: useMutability === false ? "no" : undefined }}
      onSubmit={({ useMutability }) => {
        dispatch(useMutabilityCompleted({ useMutability: useMutability === "yes" }));
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
