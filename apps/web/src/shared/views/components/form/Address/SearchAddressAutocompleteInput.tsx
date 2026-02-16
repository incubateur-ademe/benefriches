import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { ChangeEvent } from "react";
import type { Address } from "shared";

import type { AddressType, AddressWithBanId } from "@/shared/core/gateways/AddressSearchGateway";

import Autocomplete from "../../Autocomplete/Autocomplete";

export type SearchAddressAutocompleteInputProps = {
  searchInputProps: InputProps.RegularInput;
  selectedAddress?: Address;
  onSelectedAddressChange: (v: Address | undefined) => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  suggestions: AddressWithBanId[];
  addressType?: AddressType;
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

const SearchAddressAutocompleteInput = ({
  searchInputProps,
  onSelectedAddressChange,
  selectedAddress,
  searchText,
  onSearchTextChange,
  suggestions,
  addressType,
}: SearchAddressAutocompleteInputProps) => {
  const autocompleteValue = selectedAddress?.banId;

  const handleSelect = (banId: string) => {
    const address = suggestions.find((s) => s.banId === banId);
    if (address) {
      onSearchTextChange(address.value);
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
            onSearchTextChange(e.target.value);
            onSelectedAddressChange(undefined);
          },
        }}
      />
    </Autocomplete>
  );
};

export default SearchAddressAutocompleteInput;
