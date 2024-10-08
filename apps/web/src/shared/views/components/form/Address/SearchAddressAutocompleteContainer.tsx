import { useMemo } from "react";

import { NationalAddressBaseService } from "@/features/create-site/infrastructure/address-service/nationalAddressBaseApi";

import SearchAddressAutocompleteInput, {
  AddressService,
  PropTypes,
} from "./SearchAddressAutocompleteInput";

function SearchAddressAutocompleteContainer(props: Omit<PropTypes, "addressService">) {
  const addressService: AddressService = useMemo(() => new NationalAddressBaseService(), []);

  return <SearchAddressAutocompleteInput {...props} addressService={addressService} />;
}

export default SearchAddressAutocompleteContainer;
