import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { ChangeEvent, useEffect, useState } from "react";
import { Address } from "shared";

import { useDebounce } from "@/shared/views/hooks/useDebounce";

import Autocomplete from "../../Autocomplete/Autocomplete";

export type AddressWithBanId = Address & {
  banId: string; // Addresses from AddressService always have banId
};

export interface AddressService {
  search(
    searchText: string,
    options: { type?: "municipality" | "street" | "housenumber" | "locality" },
  ): Promise<AddressWithBanId[]>;
}

export type SearchAddressAutocompleteInputProps = {
  searchInputProps: InputProps.RegularInput;
  selectedAddress?: Address;
  onSelectedAddressChange: (v: Address | undefined) => void;
  addressService: AddressService;
  addressType?: "municipality" | "street" | "housenumber" | "locality";
};

const formatAddressOptionLabel = (
  address: Address,
  addressType: SearchAddressAutocompleteInputProps["addressType"],
): string => {
  switch (addressType) {
    case "municipality":
      return `${address.value} (${address.postCode})`;
    default:
      return address.value;
  }
};

const SEARCH_DEBOUNCE_DELAY_IN_MS = 300;

const SearchAddressAutocompleteInput = ({
  searchInputProps,
  onSelectedAddressChange,
  selectedAddress,
  addressService,
  addressType,
}: SearchAddressAutocompleteInputProps) => {
  const autocompleteValue = selectedAddress?.banId;

  const [searchText, setSearchText] = useState(selectedAddress?.value ?? "");
  const [suggestions, setSuggestions] = useState<AddressWithBanId[]>([]);

  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_DELAY_IN_MS);

  useEffect(() => {
    // BAN API returns error if query is less than 3 characters
    if (debouncedSearchText.length <= 3) {
      return;
    }
    void addressService.search(debouncedSearchText, { type: addressType }).then(setSuggestions);
  }, [debouncedSearchText, addressService, addressType]);

  const handleSelect = (banId: string) => {
    const address = suggestions.find((s) => s.banId === banId);
    if (address) {
      setSearchText(address.value);
      onSelectedAddressChange(address);
    }
  };

  const options = suggestions.map((address) => ({
    label: formatAddressOptionLabel(address, addressType),
    value: address.banId,
  }));

  return (
    <Autocomplete
      className="mb-4 pb-4"
      value={autocompleteValue}
      options={options}
      onSelect={handleSelect}
    >
      <Input
        {...searchInputProps}
        nativeInputProps={{
          ...searchInputProps.nativeInputProps,
          value: searchText,
          type: "search",
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
            onSelectedAddressChange(undefined);
          },
        }}
      />
    </Autocomplete>
  );
};

export default SearchAddressAutocompleteInput;
