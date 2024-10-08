import { useEffect, useMemo } from "react";
import { LocalAuthority } from "shared";

import { routes } from "@/app/views/router";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { createUser } from "../../application/createUser.action";
import CreateUserForm, { FormValues } from "./CreateUserForm";

export type AdministrativeDivision = {
  code: string;
  name: string;
  localAuthorities: {
    type: LocalAuthority;
    name: string;
    code: string;
  }[];
};

export interface AdministrativeDivisionService {
  searchMunicipality(searchText: string): Promise<AdministrativeDivision[]>;
}

function CreateUserFormContainer() {
  const dispatch = useAppDispatch();
  const createUserLoadingState = useAppSelector((state) => state.currentUser.createUserState);

  const administrativeDivisionService: AdministrativeDivisionService = useMemo(
    () => new AdministrativeDivisionGeoApi(),
    [],
  );

  const onSubmit = (data: FormValues) => {
    void dispatch(
      createUser({
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        structureType: data.structureCategory === "local_authority" ? "local_authority" : "company",
        structureActivity:
          data.structureCategory === "local_authority"
            ? data.selectedStructureLocalAuthorityType
            : data.structureCategory,
        structureName: data.structureName,
        personalDataStorageConsented: true,
        personalDataAnalyticsUseConsented: true,
        personalDataCommunicationUseConsented: true,
      }),
    );
  };

  useEffect(() => {
    if (createUserLoadingState === "success") {
      routes.createSiteFoncier().push();
    }
  }, [createUserLoadingState]);

  return (
    <CreateUserForm
      onSubmit={onSubmit}
      createUserLoadingState={createUserLoadingState}
      administrativeDivisionService={administrativeDivisionService}
    />
  );
}

export default CreateUserFormContainer;
