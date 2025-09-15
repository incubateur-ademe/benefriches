import { useEffect, useMemo } from "react";
import { LocalAuthority } from "shared";

import { createUser } from "@/features/onboarding/core/createUser.action";
import { AdministrativeDivisionGeoApi } from "@/shared/infrastructure/administrative-division-service/administrativeDivisionGeoApi";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

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

type Props = {
  onSuccess: () => void;
};

function CreateUserFormContainer({ onSuccess }: Props) {
  const currentRoute = useRoute();
  const dispatch = useAppDispatch();
  const { createUserState, createUserError } = useAppSelector((state) => state.currentUser);

  const administrativeDivisionService: AdministrativeDivisionService = useMemo(
    () => new AdministrativeDivisionGeoApi(),
    [],
  );

  const initialValues =
    currentRoute.name === routes.onBoardingIdentity.name
      ? {
          email: currentRoute.params.hintEmail,
          firstname: currentRoute.params.hintFirstName,
          lastname: currentRoute.params.hintLastName,
        }
      : {};

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
        subscribedToNewsletter: data.subscribedToNewsletter === "agreed",
      }),
    );
  };

  useEffect(() => {
    if (createUserState === "success") {
      onSuccess();
    }
  }, [createUserState, onSuccess]);

  return (
    <CreateUserForm
      predefinedValues={initialValues}
      onSubmit={onSubmit}
      createUserLoadingState={createUserState}
      createUserError={createUserError}
      administrativeDivisionService={administrativeDivisionService}
    />
  );
}

export default CreateUserFormContainer;
