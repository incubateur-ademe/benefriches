import { Address } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { selectSiteAddressViewData } from "@/features/create-site/core/demo/steps/address/address.selectors";

import AddressForm from "./AddressForm";

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, siteNature } = useAppSelector(selectSiteAddressViewData);

  return (
    <AddressForm
      selectedAddress={initialValues?.address}
      siteNature={siteNature}
      onSubmit={(address: Address) => {
        dispatch(stepCompletionRequested({ stepId: "DEMO_SITE_ADDRESS", answers: { address } }));
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default AddressFormContainer;
