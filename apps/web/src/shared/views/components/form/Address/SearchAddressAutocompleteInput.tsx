import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { ChangeEvent, useState } from "react";
import { Address, typedObjectEntries } from "shared";

import Autocomplete from "../../Autocomplete/Autocomplete";

export interface AddressService {
  search(
    searchText: string,
    options: { type?: "municipality" | "street" | "housenumber" | "locality" },
  ): Promise<Address[]>;
}

export type PropTypes = {
  searchInputValue: string | undefined;
  onSearchInputChange: (v: string) => void;
  searchInputProps: InputProps.RegularInput;
  selectedAddress?: Address;
  onSelect: (v: Address) => void;
  addressService: AddressService;
  addressType?: "municipality" | "street" | "housenumber" | "locality";
};

type BanId = string;
type Options = Record<
  BanId,
  {
    label: string;
    properties: Address;
  }
>;

const formatAddressOptionLabel = (
  address: Address,
  addressType: PropTypes["addressType"],
): string => {
  switch (addressType) {
    case "municipality":
      return `${address.value} (${address.postCode})`;
    default:
      return address.value;
  }
};

const SearchAddressAutocompleteInput = ({
  searchInputValue,
  onSearchInputChange,
  searchInputProps,
  onSelect,
  selectedAddress,
  addressService,
  addressType,
}: PropTypes) => {
  const autocompleteValue = selectedAddress?.banId;

  const [suggestions, setSuggestions] = useState<Options>({});

  const onSearch = async (text: string) => {
    // BAN API returns error if query is less than 3 characters
    if (text.length <= 3) {
      return;
    }
    const options = await addressService.search(text, { type: addressType });
    setSuggestions(
      options.reduce<Options>((result, address) => {
        return {
          ...result,
          [address.banId]: {
            label: formatAddressOptionLabel(address, addressType),
            properties: address,
          },
        };
      }, {}),
    );
  };

  const _onSelect = (value: string) => {
    const properties = suggestions[value]?.properties;
    if (properties) {
      onSelect(properties);
    }
  };

  const options = typedObjectEntries(suggestions).map(([banId, { label }]) => ({
    label: label,
    value: banId,
  }));

  return (
    <Autocomplete
      className="mb-4 pb-4"
      value={autocompleteValue}
      options={options}
      onSelect={_onSelect}
    >
      <Input
        {...searchInputProps}
        nativeInputProps={{
          ...searchInputProps.nativeInputProps,
          value: searchInputValue ?? "",
          type: "search",
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            onSearchInputChange(e.target.value);
            void onSearch(e.target.value);
          },
        }}
      />
    </Autocomplete>
  );
};

export default SearchAddressAutocompleteInput;
