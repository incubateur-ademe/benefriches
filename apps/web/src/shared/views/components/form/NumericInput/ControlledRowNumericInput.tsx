import { ChangeEvent } from "react";
import { FieldPath, FieldValues, UseControllerReturn } from "react-hook-form";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";

import RowNumericInput, { RowNumericInputInputProps } from "./RowNumericInput";

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = RowNumericInputInputProps & UseControllerReturn<TFieldValues, TName> & { noDecimals?: boolean };

const ControlledRowNumericInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  field,
  fieldState,
  nativeInputProps = {},
  stateRelatedMessage,
  state,
  noDecimals = false,
  ...props
}: Props<TFieldValues, TName>) => {
  const error = fieldState.error;

  return (
    <RowNumericInput
      state={error ? "error" : state}
      stateRelatedMessage={error?.message ?? stateRelatedMessage}
      nativeInputProps={{
        name: field.name,
        value: field.value ? numberToString(field.value) : undefined,
        onChange: (ev: ChangeEvent<HTMLInputElement>) => {
          field.onChange(stringToNumber(ev.target.value));
        },
        onBlur: field.onBlur,
        step: noDecimals ? "1" : "0.01",
        ...nativeInputProps,
      }}
      {...props}
    />
  );
};

export default ControlledRowNumericInput;
