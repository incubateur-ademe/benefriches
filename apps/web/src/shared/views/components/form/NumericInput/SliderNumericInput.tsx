import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Slider } from "antd";
import { SliderBaseProps } from "antd/es/slider";
import { ChangeEvent, ReactNode, useState } from "react";
import { FieldValues, RegisterOptions, useController, UseControllerProps } from "react-hook-form";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";

import SurfaceInput from "./RowNumericInput";

type Props<T extends FieldValues> = {
  label: ReactNode;
  imgSrc?: string;
  hintText?: string;
  hintInputText?: string;
  minValue?: number;
  maxValue?: number;
  required?: RegisterOptions["required"];
  validate?: RegisterOptions["validate"];
  sliderStartValue: number;
  sliderEndValue: number;
  sliderProps?: SliderBaseProps;
  inputProps?: InputProps["nativeInputProps"];
} & UseControllerProps<T>;

const getValidatedNewValue = (newValue: number, min: number, max: number) => {
  if (newValue > max) {
    return max;
  }
  if (newValue < min) {
    return min;
  }
  return newValue;
};

const SliderNumericInput = <T extends FieldValues>({
  control,
  name,
  minValue,
  maxValue,
  required,
  validate,
  label,
  imgSrc,
  hintText,
  hintInputText,
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

  const [inputValue, setInputValue] = useState<string>(field.value);

  const onChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  const onLeaveInput = () => {
    const newValue = stringToNumber(inputValue);
    if (newValue !== null) {
      onChangeNumericSliderInput(newValue);
      return;
    }
    // si la valeur entrée manuellement n'est pas valide, on remet la valeur actuelle
    setInputValue(field.value);
  };

  const onChangeNumericSliderInput = (newValue: number) => {
    const validatedNewValue = getValidatedNewValue(newValue, min, max);
    field.onChange(validatedNewValue);
    setInputValue(numberToString(validatedNewValue));
  };

  const error = fieldState.error;

  return (
    <div className="fr-col">
      <SurfaceInput
        label={label}
        imgSrc={imgSrc}
        hintText={hintText}
        hintInputText={hintInputText}
        state={error ? "error" : "default"}
        stateRelatedMessage={error ? error.message : undefined}
        nativeInputProps={{
          min,
          max,
          type: "number",
          value: inputValue,
          onChange: onChangeInput,
          onClick: onLeaveInput, // TODO à améliorer: le click sur les boutons +- ne trigger pas d'event focus
          onBlur: onLeaveInput,
          ...inputProps,
        }}
      />

      <Slider
        className="fr-col tw-my-4"
        onChange={onChangeNumericSliderInput}
        value={field.value}
        min={sliderStartValue}
        max={sliderEndValue}
        {...sliderProps}
      />
    </div>
  );
};

export default SliderNumericInput;
