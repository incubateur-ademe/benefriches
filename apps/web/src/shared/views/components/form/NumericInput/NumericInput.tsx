import { ChangeEvent } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import DsfrInput from "@codegouvfr/react-dsfr/Input";

type Props<T extends FieldValues> = {
  label: string;
  hintText?: string;
} & UseControllerProps<T>;

const stringToNumber = (value: string) => {
  const output = parseInt(value, 10);
  return isNaN(output) ? undefined : output;
};

const numberToString = (value: number) => {
  return isNaN(value) ? "" : value.toString();
};

const NumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  hintText,
  rules,
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
    onChange: (ev: ChangeEvent<HTMLInputElement>) =>
      field.onChange(stringToNumber(ev.target.value)),
    onBlur: field.onBlur,
    type: "number",
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
