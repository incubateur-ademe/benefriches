import { Controller, ControllerProps, FieldValues } from "react-hook-form";

import { stringToNumber } from "@/shared/core/number-conversion/numberConversion";

import RowNumericInput, { RowNumericInputInputProps } from "./RowNumericInput";
import {
  optionalNumericFieldRegisterOptions,
  requiredNumericFieldRegisterOptions,
} from "./registerOptions";

type Props<TFieldValues extends Record<string, number> = Record<string, number>> = {
  controller: Omit<ControllerProps<TFieldValues>, "render" | "rules"> & {
    rules?: ControllerProps<TFieldValues>["rules"];
  };
  required?: boolean;
} & RowNumericInputInputProps;

const formatNumber = (value?: number) => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") ?? "";
};

const FormRowNumericInput = <TFieldValues extends FieldValues = FieldValues>({
  controller,
  required = false,
  nativeInputProps,
  ...props
}: Props<TFieldValues>) => {
  const defaultRules = required
    ? requiredNumericFieldRegisterOptions
    : optionalNumericFieldRegisterOptions;

  const { rules = {}, ...controllerProps } = controller;

  return (
    <Controller
      rules={{ ...defaultRules, ...rules }}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <RowNumericInput
          nativeInputProps={{
            ...nativeInputProps,
            ...field,
            onChange: (e) => {
              field.onChange(stringToNumber(e.target.value.toString().replace(/[^\d]/g, "")) ?? "");
            },
            value: formatNumber(field.value),
            pattern: "[\\d\\s]*",
          }}
          required={Boolean(rules.required)}
          state={fieldState.error ? "error" : "default"}
          stateRelatedMessage={fieldState.error?.message}
          {...props}
        />
      )}
    />
  );
};

export default FormRowNumericInput;
