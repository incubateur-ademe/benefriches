import { Address } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useDemoSiteForm } from "@/features/create-site/views/site-form/useDemoSiteForm";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteAddressViewData } = useDemoSiteForm();
  const { initialValues, siteNature } = useAppSelector(selectSiteAddressViewData);

  return (
    <AddressForm
      selectedAddress={initialValues?.address}
      siteNature={siteNature}
      onSubmit={(address: Address) => {
        onRequestStepCompletion({ stepId: "DEMO_SITE_ADDRESS", answers: { address } });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default AddressFormContainer;
