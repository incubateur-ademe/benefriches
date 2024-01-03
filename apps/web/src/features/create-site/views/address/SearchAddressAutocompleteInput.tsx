import { ChangeEvent, useState } from "react";
import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { AutoComplete } from "antd";

import { Address } from "@/features/create-site/domain/siteFoncier.types";
import MarkerLeafletMap from "@/shared/views/components/MarkerLeafletMap/MarkerLeafletMap";

export interface AddressService {
  search(searchText: string): Promise<Address[]>;
}

export type PropTypes = {
  searchInputValue: string;
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
  const autocompleteValue = selectedAddress?.id;
  const { long, lat } = selectedAddress ?? {};

  const [suggestions, setSuggestions] = useState<Option[]>([]);

  const onSearch = async (text: string) => {
    // BAN API returns error if query is less than 3 characters
    if (text.length <= 3) {
      return;
    }
    const options = await addressService.search(text);
    setSuggestions(
      options.map((address) => ({
        value: address.id,
        label: address.value,
        properties: address,
      })),
    );
  };

  const _onSelect = (_: string, option: Option) => {
    onSelect(option.properties);
  };

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <AutoComplete
        className="fr-col-17 fr-col-lg-5 fr-mb-12v"
        value={autocompleteValue}
        style={{ width: "100%" }}
        options={suggestions}
        onSelect={_onSelect}
        onSearch={onSearch}
      >
        <Input
          {...searchInputProps}
          nativeInputProps={{
            value: searchInputValue ?? "",
            onChange: (e: ChangeEvent<HTMLInputElement>) => onSearchInputChange(e.target.value),
          }}
        />
      </AutoComplete>
      <div className="fr-col-12 fr-col-lg-7">
        <MarkerLeafletMap lat={lat} long={long} popup={searchInputValue} />
      </div>
    </div>
  );
};

export default SearchAddressAutocompleteInput;
