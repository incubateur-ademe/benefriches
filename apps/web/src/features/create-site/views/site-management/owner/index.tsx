import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import {
  goToStep,
  setOwner,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { selectCurrentUserCompany } from "@/features/users/application/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, currentUserCompany: string) => {
  return {
    currentUserCompany,
    onSubmit: (data: FormValues) => {
      switch (data.ownerType) {
        case "local_or_regional_authority":
          dispatch(
            setOwner({
              structureType: "local_or_regional_authority",
              name: data.localAndRegionalAuthorityType,
            }),
          );
          break;
        case "user_company":
          dispatch(setOwner({ structureType: "company", name: currentUserCompany }));
          break;
        case "other_company":
          dispatch(setOwner({ structureType: "company", name: data.ownerName }));
          break;
        case "private_individual":
          dispatch(
            setOwner({
              structureType: "private_individual",
              name: data.ownerName,
            }),
          );
          break;
      }
      dispatch(goToStep(SiteCreationStep.TENANT));
    },
  };
};

function SiteOwnerFormContainer() {
  const currentUserCompany = useAppSelector(selectCurrentUserCompany);
  const dispatch = useAppDispatch();

  return <SiteOwnerForm {...mapProps(dispatch, currentUserCompany)} />;
}

export default SiteOwnerFormContainer;
