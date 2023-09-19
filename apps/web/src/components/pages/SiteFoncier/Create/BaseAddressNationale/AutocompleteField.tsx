import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";

import { AutoComplete } from "antd";
import { ChangeEvent, useState } from "react";
import { RefCallBack } from "react-hook-form";

import MarkerLeafletMap from "./MarkerLeafletMap";
import banSearch, { BanFeature } from "./search";

type Value = {
  address?: string;
  ban?: BanFeature;
};

type PropsType = {
  value: Value;
  onChange: (props: Value) => void;
  inputProps: InputProps.RegularInput;
  inputRef: RefCallBack;
};

type Option = {
  label: string;
  value: string;
  ban: BanFeature;
};

const BaseAdresseNationaleAutocomplete = (props: PropsType) => {
  const { value, onChange, inputRef } = props;

  const autocompleteValue = value?.ban?.properties?.id;
  const inputValue = value?.address;
  const popupValue = value?.ban?.properties.label;

  const [suggestions, setSuggestions] = useState<Option[]>([]);

  const onSearch = async (text: string) => {
    // BAN API returns error if query is less than 3 characters
    if (text.length < 3) {
      return;
    }
    const options = await banSearch(text);
    setSuggestions(
      options.map(({ properties, ...rest }) => ({
        value: properties.id,
        label: properties.label,
        ban: { properties, ...rest },
      })),
    );
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ address: e.target.value });

  const onSelect = (_: string, option: Option) => {
    onChange({ address: option.ban.properties.label, ban: option.ban });
  };

  // In GeoJSON format, coordinates are ordered in longitude-latitude format, the same as X-Y coordinates in mathematics.
  // This is the opposite of Open Street Map, which place coordinate values in latitude-longitude format.
  const [long, lat] = value?.ban?.geometry.coordinates || [];

  return (
    <>
      <AutoComplete
        className="fr-pb-7v"
        value={autocompleteValue}
        style={{ width: "100%" }}
        options={suggestions}
        onSelect={onSelect}
        onSearch={onSearch}
      >
        <Input
          {...props.inputProps}
          nativeInputProps={{
            value: inputValue || "",
            onChange: onInputChange,
            ref: inputRef,
          }}
        />
      </AutoComplete>
      {long && lat && (
        <MarkerLeafletMap lat={lat} long={long} popup={popupValue} />
      )}
    </>
  );
};

export default BaseAdresseNationaleAutocomplete;
