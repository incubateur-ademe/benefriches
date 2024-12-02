import {
  selectIsFriche,
  selectSiteAddress,
} from "@/features/create-site/application/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertAddressStep } from "../../../application/createSite.actions";
import { completeAddressStep } from "../../../application/createSite.reducer";
import { Address } from "../../../domain/siteFoncier.types";
import AddressForm from "./AddressForm";

const mapInitialValues = (address: Address | undefined) => {
  if (!address) return { selectedAddress: undefined, searchText: "" };
  return { selectedAddress: address, searchText: address.value };
};

function AddressFormContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector(selectIsFriche);
  const address = useAppSelector(selectSiteAddress);

  return (
    <AddressForm
      initialValues={mapInitialValues(address)}
      isFriche={!!isFriche}
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
