import { useMemo } from "react";

import type { AddressType } from "@/shared/core/gateways/AddressSearchGateway";
import { NationalAddressBaseService } from "@/shared/infrastructure/address-service/nationalAddressBaseApi";
import { useAddressSearch } from "@/shared/views/hooks/useAddressSearch";

import SearchAddressAutocompleteInput, {
  type SearchAddressAutocompleteInputProps,
} from "./SearchAddressAutocompleteInput";

type SearchAddressAutocompleteContainerProps = Omit<
  SearchAddressAutocompleteInputProps,
  "searchText" | "onSearchTextChange" | "suggestions" | "searchFeedback"
> & { addressType?: AddressType };

function SearchAddressAutocompleteContainer({
  addressType,
  selectedAddress,
  ...props
}: SearchAddressAutocompleteContainerProps) {
  const addressService = useMemo(() => new NationalAddressBaseService(), []);
  // display the already selected address (if any) when the component mounts
  const { searchText, setSearchText, suggestions, searchFeedback } = useAddressSearch(
    addressService,
    addressType,
    selectedAddress?.value,
  );

  return (
    <SearchAddressAutocompleteInput
      {...props}
      selectedAddress={selectedAddress}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      suggestions={suggestions}
      searchFeedback={searchFeedback}
    />
  );
}

export default SearchAddressAutocompleteContainer;
