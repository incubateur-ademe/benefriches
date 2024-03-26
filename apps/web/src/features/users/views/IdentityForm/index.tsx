import { useEffect } from "react";
import { createIdentity } from "../../application/createIdentity.action";
import IdentityForm, { FormValues } from "./IdentityForm";

import { routes } from "@/app/views/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function IdentityFormContainer() {
  const dispatch = useAppDispatch();
  const saveIdentityLoadingState = useAppSelector((state) => state.currentUser.saveIdentityState);
  const onSubmit = (data: FormValues) => {
    void dispatch(
      createIdentity({
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        structureType: data.structureType,
        structureName: data.structureName,
        personalDataStorageConsented: true,
        personalDataAnalyticsUseConsented: true,
        personalDataCommunicationUseConsented: true,
      }),
    );
  };

  useEffect(() => {
    if (saveIdentityLoadingState === "success") {
      routes.createSiteFoncierIntro().push();
    }
  }, [saveIdentityLoadingState]);

  return <IdentityForm onSubmit={onSubmit} saveIdentityLoadingState={saveIdentityLoadingState} />;
}

export default IdentityFormContainer;
