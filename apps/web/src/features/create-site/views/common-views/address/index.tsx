import type { Address } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectAddressFormViewData } from "@/features/create-site/core/steps/address/address.selectors";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const { siteNature, address } = useAppSelector(selectAddressFormViewData);

  return (
    <AddressForm
      selectedAddress={address}
      siteNature={siteNature}
      onSubmit={(addressData: Address) => {
        dispatch(stepCompletionRequested({ stepId: "ADDRESS", answers: { address: addressData } }));
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default AddressFormContainer;
