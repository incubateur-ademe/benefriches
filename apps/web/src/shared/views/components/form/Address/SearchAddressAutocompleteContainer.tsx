import { useMemo } from "react";

import { NationalAddressBaseService } from "@/shared/infrastructure/address-service/nationalAddressBaseApi";
import { useAddressSearch } from "@/shared/views/hooks/useAddressSearch";

import SearchAddressAutocompleteInput, {
  type SearchAddressAutocompleteInputProps,
} from "./SearchAddressAutocompleteInput";

type SearchAddressAutocompleteContainerProps = Omit<
  SearchAddressAutocompleteInputProps,
  "searchText" | "onSearchTextChange" | "suggestions"
>;

function SearchAddressAutocompleteContainer({
  addressType,
  selectedAddress,
  ...props
}: SearchAddressAutocompleteContainerProps) {
  const addressService = useMemo(() => new NationalAddressBaseService(), []);
  // display the already selected address (if any) when the component mounts
  const { searchText, setSearchText, suggestions } = useAddressSearch(
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
      addressType={addressType}
    />
  );
}

export default SearchAddressAutocompleteContainer;
