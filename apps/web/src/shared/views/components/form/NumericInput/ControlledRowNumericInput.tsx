import { ChangeEvent } from "react";
import { FieldPath, FieldValues, UseControllerReturn } from "react-hook-form";
import RowNumericInput, { RowNumericInputInputProps } from "./RowNumericInput";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = RowNumericInputInputProps & UseControllerReturn<TFieldValues, TName>;

const ControlledRowNumericInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  field,
  fieldState,
  nativeInputProps = {},
  stateRelatedMessage,
  state,
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
        ...nativeInputProps,
      }}
      {...props}
    />
  );
};

export default ControlledRowNumericInput;
