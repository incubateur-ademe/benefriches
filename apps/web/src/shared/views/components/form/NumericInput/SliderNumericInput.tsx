import { ChangeEvent } from "react";
import {
  FieldValues,
  RegisterOptions,
  useController,
  UseControllerProps,
} from "react-hook-form";
import DsfrInput, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Slider } from "antd";
import { SliderBaseProps } from "antd/es/slider";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";
import { getPercentage } from "@/shared/services/percentage/percentage";

type Props<T extends FieldValues> = {
  label: string;
  hintText?: string;
  minValue?: number;
  maxValue?: number;
  required?: RegisterOptions["required"];
  validate?: RegisterOptions["validate"];
  sliderStartValue: number;
  sliderEndValue: number;
  sliderProps?: SliderBaseProps;
  inputProps?: InputProps["nativeInputProps"];
} & UseControllerProps<T>;

const SliderNumericInput = <T extends FieldValues>({
  control,
  name,
  minValue,
  maxValue,
  required,
  validate,
  label,
  hintText,
  sliderStartValue,
  sliderEndValue,
  sliderProps,
  inputProps,
}: Props<T>) => {
  const min = minValue ?? sliderStartValue;
  const max = maxValue ?? sliderEndValue;
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: {
      min,
      max,
      required,
      validate,
    },
  });

  const onChangeSlider = (newValue: number) =>
    onChangeNumericSliderInput(newValue);

  const onChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const newValue = stringToNumber(ev.target.value);
    if (newValue) {
      onChangeNumericSliderInput(newValue);
    }
  };

  const onChangeNumericSliderInput = (newValue: number) => {
    if (newValue > max) {
      return field.onChange(max);
    }
    if (newValue < min) {
      return field.onChange(min);
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
          min,
          max,
          type: "number",
          name: field.name,
          value: numberToString(field.value),
          onChange: onChangeInput,
          onBlur: field.onBlur,
          style: { width: "150px" },
          ...inputProps,
        }}
        style={{ display: "flex", justifyContent: "space-between" }}
      />

      <legend style={{ display: "flex", justifyContent: "flex-end" }}>
        {Math.round(getPercentage(field.value, sliderEndValue))}%
      </legend>

      <Slider
        className="fr-col"
        onChange={onChangeSlider}
        value={field.value}
        min={sliderStartValue}
        max={sliderEndValue}
        {...sliderProps}
      />
    </div>
  );
};

export default SliderNumericInput;
