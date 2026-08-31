import type { Address } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const { onBack, onRequestStepCompletion, selectAddressFormViewData } = useCustomSiteForm();
  const { siteNature, address } = useAppSelector(selectAddressFormViewData);

  return (
    <AddressForm
      selectedAddress={address}
      siteNature={siteNature}
      onSubmit={(addressData: Address) => {
        onRequestStepCompletion({ stepId: "ADDRESS", answers: { address: addressData } });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default AddressFormContainer;
