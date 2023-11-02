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
  maxAvailable: number;
  sliderProps: SliderBaseProps;
  inputNativeProps: InputProps["nativeInputProps"];
} & UseControllerProps<T>;

const SliderNumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  hintText,
  maxAvailable,
  sliderProps,
  inputNativeProps,
}: Props<T>) => {
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: {
      max: maxAvailable,
    },
  });

  const onChangeSlider = (newValue: number) => {
    if (newValue >= maxAvailable) {
      return field.onChange(maxAvailable);
    }
    field.onChange(newValue);
  };

  const error = fieldState.error;

  const nativeInputProps = {
    name: field.name,
    value: numberToString(field.value),
    onChange: (ev: ChangeEvent<HTMLInputElement>) =>
      field.onChange(stringToNumber(ev.target.value)),
    onBlur: field.onBlur,
    type: "number",
    style: { width: "150px" },
    max: maxAvailable,
    min: 0,
    ...inputNativeProps,
  };

  return (
    <div className="fr-col">
      <DsfrInput
        className="fr-col fr-mb-0 fr-pt-7v"
        label={label}
        hintText={hintText}
        state={error ? "error" : "default"}
        stateRelatedMessage={error ? error.message : undefined}
        nativeInputProps={nativeInputProps}
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
