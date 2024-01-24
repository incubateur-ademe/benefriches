import {
  goToStep,
  setAddress,
  SiteCreationState,
  SiteCreationStep,
} from "../../application/createSite.reducer";
import { Address } from "../../domain/siteFoncier.types";
import AddressForm from "./AddressForm";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, creationState: SiteCreationState) => {
  return {
    isFriche: creationState.siteData.isFriche!,
    onSubmit: (address: Address) => {
      dispatch(setAddress(address));
      dispatch(goToStep(SiteCreationStep.SOILS_INTRODUCTION));
    },
  };
};

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const creationState = useAppSelector((state) => state.siteCreation);

  return <AddressForm {...mapProps(dispatch, creationState)} />;
}

export default AddressFormContainer;
