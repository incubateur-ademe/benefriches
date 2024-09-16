import { ChangeEvent, useState } from "react";
import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { AutoComplete } from "antd";

import { Address } from "@/features/create-site/domain/siteFoncier.types";

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

type Option = {
  label: string;
  value: string;
  properties: Address;
};

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

  const [suggestions, setSuggestions] = useState<Option[]>([]);

  const onSearch = async (text: string) => {
    // BAN API returns error if query is less than 3 characters
    if (text.length <= 3) {
      return;
    }
    const options = await addressService.search(text, { type: addressType });
    setSuggestions(
      options.map((address) => ({
        value: address.banId,
        label: formatAddressOptionLabel(address, addressType),
        properties: address,
      })),
    );
  };

  const _onSelect = (_: string, option: Option) => {
    onSelect(option.properties);
  };

  return (
    <div>
      <AutoComplete
        className="fr-mb-8w tw-w-full"
        value={autocompleteValue}
        options={suggestions}
        onSelect={_onSelect}
        onSearch={onSearch}
      >
        <Input
          {...searchInputProps}
          nativeInputProps={{
            value: searchInputValue ?? "",
            type: "search",
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              onSearchInputChange(e.target.value);
            },
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default SearchAddressAutocompleteInput;
