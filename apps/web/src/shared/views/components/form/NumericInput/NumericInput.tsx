import DsfrInput from "@codegouvfr/react-dsfr/Input";
import { ChangeEvent, ReactNode } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";
import classNames from "@/shared/views/clsx";

type Props<T extends FieldValues> = {
  label: ReactNode;
  addonText?: ReactNode;
  hintText?: ReactNode;
  placeholder?: string;
  className?: string;
  allowDecimals?: boolean;
} & UseControllerProps<T>;

const NumericInput = <T extends FieldValues>({
  control,
  name,
  label,
  addonText,
  rules,
  placeholder,
  className,
  hintText,
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
      addon={
        addonText ? (
          <div
            className={classNames(
              "tw-px-2 tw-pt-[8px]",
              "tw-bg-dsfr-contrastGrey",
              "tw-text-nowrap",
              "tw-border-solid tw-border-0 tw-border-b-2 tw-border-[#000091]",
              error && "tw-border-dsfr-red",
            )}
          >
            {addonText}
          </div>
        ) : null
      }
    />
  );
};

export default NumericInput;
