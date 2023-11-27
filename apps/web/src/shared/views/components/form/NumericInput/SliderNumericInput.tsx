import { ChangeEvent, useState } from "react";
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

  const [inputValue, setInputValue] = useState<string>(field.value);

  const onChangeInput = (ev: ChangeEvent<HTMLInputElement>) =>
    setInputValue(ev.target.value);

  const onLeaveInput = () => {
    const newValue = stringToNumber(inputValue);
    if (newValue !== undefined) {
      return onChangeNumericSliderInput(newValue);
    }
    // si la valeur entrée manuellement n’est pas valide, on remet la valeur actuelle
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
          value: inputValue,
          onChange: onChangeInput,
          onClick: onLeaveInput, // TODO à améliorer: le click sur les boutons +- ne trigger pas d’event focus
          onBlur: onLeaveInput,
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
