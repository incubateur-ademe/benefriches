import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import {
  goToStep,
  setOwner,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { OwnerType } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      switch (data.ownerType) {
        case "LOCAL_OR_REGIONAL_AUTHORITY":
          dispatch(
            setOwner({ type: data.localAndRegionalAuthorityType as OwnerType }),
          );
          break;
        case "USER_COMPANY":
        case "OTHER_COMPANY":
          dispatch(setOwner({ type: OwnerType.COMPANY, name: data.ownerName }));
          break;
        case "PRIVATE_INDIVIDUAL":
          dispatch(
            setOwner({
              type: OwnerType.PRIVATE_INDIVIDUAL,
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
  const dispatch = useAppDispatch();

  return <SiteOwnerForm {...mapProps(dispatch)} />;
}

export default SiteOwnerFormContainer;
