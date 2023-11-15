import { ChangeEvent } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import DsfrInput, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Slider } from "antd";
import { SliderBaseProps } from "antd/es/slider";
import { numberToString, stringToNumber } from "./helpers";

import { getPercentage } from "@/shared/services/percentage/percentage";

type Props<T extends FieldValues> = {
  label: string;
  hintText?: string;
  maxAllowed: number;
  sliderProps: SliderBaseProps;
  inputProps: InputProps["nativeInputProps"];
} & UseControllerProps<T>;

const SliderNumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  hintText,
  maxAllowed,
  sliderProps,
  inputProps,
}: Props<T>) => {
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: {
      min: 0,
      max: maxAllowed,
    },
  });

  const onChangeSlider = (newValue: number) => {
    if (newValue >= maxAllowed) {
      return field.onChange(maxAllowed);
    }
    field.onChange(newValue);
  };

  const error = fieldState.error;

  return (
    <div className="fr-col">
      <DsfrInput
        className="fr-col fr-mb-0 fr-pt-7v"
        label={label}
        hintText={hintText}
        state={error ? "error" : "default"}
        stateRelatedMessage={error ? error.message : undefined}
        nativeInputProps={{
          type: "number",
          name: field.name,
          value: numberToString(field.value),
          onChange: (ev: ChangeEvent<HTMLInputElement>) =>
            field.onChange(stringToNumber(ev.target.value)),
          onBlur: field.onBlur,
          min: 0,
          max: maxAllowed,
          style: { width: "150px" },
          ...inputProps,
        }}
        style={{ display: "flex", justifyContent: "space-between" }}
      />

      {sliderProps.max && (
        <legend style={{ display: "flex", justifyContent: "flex-end" }}>
          {Math.round(getPercentage(field.value, sliderProps.max))}%
        </legend>
      )}

      <Slider
        className="fr-col"
        onChange={onChangeSlider}
        value={field.value}
        {...sliderProps}
      />
    </div>
  );
};

export default SliderNumericInput;
