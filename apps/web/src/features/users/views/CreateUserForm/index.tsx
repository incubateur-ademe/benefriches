import { useEffect } from "react";
import { createUser } from "../../application/createUser.action";
import CreateUserForm, { FormValues } from "./CreateUserForm";

import { routes } from "@/app/views/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function CreateUserFormContainer() {
  const dispatch = useAppDispatch();
  const createUserLoadingState = useAppSelector((state) => state.currentUser.createUserState);

  const onSubmit = (data: FormValues) => {
    void dispatch(
      createUser({
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        structureType: data.structureActivity === "local_authority" ? "local_authority" : "company",
        structureActivity: data.structureActivity,
        structureName: data.structureName,
        personalDataStorageConsented: true,
        personalDataAnalyticsUseConsented: true,
        personalDataCommunicationUseConsented: true,
      }),
    );
  };

  useEffect(() => {
    if (createUserLoadingState === "success") {
      routes.createSiteFoncierIntro().push();
    }
  }, [createUserLoadingState]);

  return <CreateUserForm onSubmit={onSubmit} createUserLoadingState={createUserLoadingState} />;
}

export default CreateUserFormContainer;
