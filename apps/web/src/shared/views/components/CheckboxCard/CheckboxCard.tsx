import { ReactNode, useId, useState } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

import { getCustomCheckboxStyle, getCustomRadioButtonStyle } from "./styles";

export type CheckboxCardProps = {
  children: ReactNode;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  checkType?: "checkbox" | "radio";
  className?: ClassValue;
};

type CheckIconProps = {
  checked: boolean;
  disabled?: boolean;
};

function RadioInputIcon({ checked, disabled = false }: CheckIconProps) {
  return (
    <div
      className={classNames(
        "tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-12",
        disabled && "tw-filter tw-grayscale tw-opacity-50",
      )}
      style={{ ...getCustomRadioButtonStyle(checked), backgroundPosition: "right 16px top 16px" }}
    />
  );
}

function CheckboxInputIcon({ checked, disabled = false }: CheckIconProps) {
  return (
    <div
      className={classNames(
        "tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-12 tw-m-4",
        disabled && "tw-filter tw-grayscale tw-opacity-50",
      )}
      style={getCustomCheckboxStyle(checked)}
    />
  );
}

export default function CheckboxCard({
  children,
  checked,
  onChange,
  disabled = false,
  checkType = "radio",
  className,
}: CheckboxCardProps) {
  const id = useId();
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div
      className={classNames(
        "tw-relative tw-border tw-border-solid",
        checked || hasFocus ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
        checked && hasFocus && "tw-ring-2",
        className,
      )}
      role={checkType}
    >
      <input
        type={checkType}
        className="!tw-opacity-0 tw-h-6 tw-w-6 tw-absolute tw-top-[19px] tw-right-[19px]"
        id={id}
        value={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onBlur={() => {
          setHasFocus(false);
        }}
        onFocus={() => {
          setHasFocus(true);
        }}
      />
      <label htmlFor={id} className="tw-w-full">
        {children}
        {checkType === "radio" ? (
          <RadioInputIcon checked={checked} disabled={disabled} />
        ) : (
          <CheckboxInputIcon checked={checked} disabled={disabled} />
        )}
      </label>
    </div>
  );
}
