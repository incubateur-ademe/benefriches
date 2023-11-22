import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import {
  goToStep,
  setOwner,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
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
          dispatch(
            setOwner({ structureType: "company", name: "Générale du Solaire" }),
          );
          break;
        case "other_company":
          dispatch(
            setOwner({ structureType: "company", name: data.ownerName }),
          );
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
  const dispatch = useAppDispatch();

  return <SiteOwnerForm {...mapProps(dispatch)} />;
}

export default SiteOwnerFormContainer;
