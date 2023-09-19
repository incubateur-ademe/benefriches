import { useState } from "react";
import { AutoComplete } from "antd";
import banSearch, { BanFeature } from "@/helpers/baseAdresseNationaleSearch";
import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";

type Value = {
  address?: string;
  ban?: BanFeature;
};

type PropsType = {
  value: Value;
  onChange: (props: Value) => void;
  inputProps: InputProps.RegularInput;
};

type Option = {
  label: string;
  value: string;
  ban: BanFeature;
};

const BaseAdresseNationaleAutocomplete = (props: PropsType) => {
  const { value, onChange } = props;

  const [suggestions, setSuggestions] = useState<Option[]>([]);

  const onSelect = (_: string, option: Option) => {
    onChange({ address: option.ban.properties.label, ban: option.ban });
  };

  const autocompleteValue = value?.ban?.properties?.id;
  const inputValue = value?.address;

  const autocompleteOnChange = (data: string) => {
    onChange({ address: data });
  };

  const onSearch = async (text: string) => {
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

  return (
    <>
      <AutoComplete
        className="fr-pb-7v"
        value={autocompleteValue}
        style={{ width: "100%" }}
        options={suggestions}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={autocompleteOnChange}
      >
        <Input
          {...props.inputProps}
          nativeInputProps={{ value: inputValue || "" }}
        />
      </AutoComplete>
    </>
  );
};

export default BaseAdresseNationaleAutocomplete;
