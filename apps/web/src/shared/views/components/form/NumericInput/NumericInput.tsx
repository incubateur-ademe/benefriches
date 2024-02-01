import { ChangeEvent, ReactNode } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import DsfrInput from "@codegouvfr/react-dsfr/Input";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";

type Props<T extends FieldValues> = {
  label: ReactNode;
  hintText?: string;
  placeholder?: string;
} & UseControllerProps<T>;

const NumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  hintText,
  rules,
  placeholder,
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
    value: numberToString(field.value),
    onChange: (ev: ChangeEvent<HTMLInputElement>) => {
      field.onChange(stringToNumber(ev.target.value));
    },
    onBlur: field.onBlur,
    type: "number",
    placeholder,
  };

  return (
    <DsfrInput
      label={label}
      hintText={hintText}
      state={error ? "error" : "default"}
      stateRelatedMessage={error ? error.message : undefined}
      nativeInputProps={nativeInputProps}
    />
  );
};

export default NumericInput;
