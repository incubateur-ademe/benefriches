import type { Address } from "shared";

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { addressStepCompleted } from "@/features/create-site/core/steps/address/address.actions";
import { selectAddressFormViewData } from "@/features/create-site/core/steps/address/address.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const { siteNature, address } = useAppSelector(selectAddressFormViewData);

  return (
    <AddressForm
      selectedAddress={address}
      siteNature={siteNature}
      onSubmit={(addressData: Address) => {
        dispatch(addressStepCompleted({ address: addressData }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default AddressFormContainer;
