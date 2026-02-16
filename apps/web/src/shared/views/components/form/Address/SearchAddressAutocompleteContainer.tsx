import { useMemo } from "react";

import { NationalAddressBaseService } from "@/features/create-site/infrastructure/address-service/nationalAddressBaseApi";
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
  ...props
}: SearchAddressAutocompleteContainerProps) {
  const addressService = useMemo(() => new NationalAddressBaseService(), []);
  const { searchText, setSearchText, suggestions } = useAddressSearch(addressService, addressType);

  return (
    <SearchAddressAutocompleteInput
      {...props}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      suggestions={suggestions}
      addressType={addressType}
    />
  );
}

export default SearchAddressAutocompleteContainer;
export type { SearchAddressAutocompleteContainerProps };
