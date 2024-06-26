import { ChangeEvent, useState } from "react";
import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { AutoComplete } from "antd";

import { Address } from "@/features/create-site/domain/siteFoncier.types";

export interface AddressService {
  search(searchText: string): Promise<Address[]>;
}

export type PropTypes = {
  searchInputValue: string | undefined;
  onSearchInputChange: (v: string) => void;
  searchInputProps: InputProps.RegularInput;
  selectedAddress?: Address;
  onSelect: (v: Address) => void;
  addressService: AddressService;
};

type Option = {
  label: string;
  value: string;
  properties: Address;
};

const SearchAddressAutocompleteInput = ({
  searchInputValue,
  onSearchInputChange,
  searchInputProps,
  onSelect,
  selectedAddress,
  addressService,
}: PropTypes) => {
  const autocompleteValue = selectedAddress?.banId;

  const [suggestions, setSuggestions] = useState<Option[]>([]);

  const onSearch = async (text: string) => {
    // BAN API returns error if query is less than 3 characters
    if (text.length <= 3) {
      return;
    }
    const options = await addressService.search(text);
    setSuggestions(
      options.map((address) => ({
        value: address.banId,
        label: address.value,
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
