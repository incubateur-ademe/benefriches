import { useMemo } from "react";

import { NationalAddressBaseService } from "@/features/create-site/infrastructure/address-service/nationalAddressBaseApi";

import SearchAddressAutocompleteInput, {
  type AddressService,
  type SearchAddressAutocompleteInputProps,
} from "./SearchAddressAutocompleteInput";

type SearchAddressAutocompleteContainerProps = Omit<
  SearchAddressAutocompleteInputProps,
  "addressService"
>;

function SearchAddressAutocompleteContainer(props: SearchAddressAutocompleteContainerProps) {
  const addressService: AddressService = useMemo(() => new NationalAddressBaseService(), []);

  return <SearchAddressAutocompleteInput {...props} addressService={addressService} />;
}

export default SearchAddressAutocompleteContainer;
export type { SearchAddressAutocompleteContainerProps };
