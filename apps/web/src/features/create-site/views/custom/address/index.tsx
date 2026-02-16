import { Address } from "shared";

import { addressStepCompleted } from "@/features/create-site/core/actions/introduction.actions";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { selectSiteAddress } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const address = useAppSelector(selectSiteAddress);

  return (
    <AddressForm
      selectedAddress={address}
      siteNature={siteNature}
      onSubmit={(address: Address) => {
        dispatch(addressStepCompleted({ address }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default AddressFormContainer;
