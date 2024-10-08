import DsfrInput from "@codegouvfr/react-dsfr/Input";
import { ChangeEvent, ReactNode } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";

type Props<T extends FieldValues> = {
  label: ReactNode;
  hintText?: ReactNode;
  placeholder?: string;
  className?: string;
  allowDecimals?: boolean;
} & UseControllerProps<T>;

const NumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  hintText,
  rules,
  placeholder,
  className,
  allowDecimals = true,
}: Props<T>) => {
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules,
    shouldUnregister: true,
  });

  const error = fieldState.error;

  const nativeInputProps = {
    name: field.name,
    value: field.value ? numberToString(field.value) : undefined,
    onChange: (ev: ChangeEvent<HTMLInputElement>) => {
      field.onChange(stringToNumber(ev.target.value));
    },
    onBlur: field.onBlur,
    type: "number",
    step: allowDecimals ? "0.01" : "1",
    placeholder,
  };

  return (
    <DsfrInput
      label={label}
      hintText={hintText}
      state={error ? "error" : "default"}
      stateRelatedMessage={error ? error.message : undefined}
      nativeInputProps={nativeInputProps}
      className={className}
    />
  );
};

export default NumericInput;
