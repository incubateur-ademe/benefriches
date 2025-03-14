import { Address } from "shared";

import { selectSiteAddress } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertAddressStep } from "../../../core/actions/createSite.actions";
import { completeAddressStep } from "../../../core/createSite.reducer";
import AddressForm from "./AddressForm";

const mapInitialValues = (address: Address | undefined) => {
  if (!address) return { selectedAddress: undefined, searchText: "" };
  return { selectedAddress: address, searchText: address.value };
};

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const address = useAppSelector(selectSiteAddress);

  return (
    <AddressForm
      initialValues={mapInitialValues(address)}
      siteNature={siteNature}
      onSubmit={(address: Address) => {
        dispatch(completeAddressStep({ address }));
      }}
      onBack={() => {
        dispatch(revertAddressStep());
      }}
    />
  );
}

export default AddressFormContainer;
