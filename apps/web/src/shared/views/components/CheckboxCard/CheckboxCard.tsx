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
        "absolute top-0 right-0 w-full h-12",
        disabled && "filter grayscale opacity-50",
      )}
      style={{ ...getCustomRadioButtonStyle(checked), backgroundPosition: "right 16px top 16px" }}
    />
  );
}

function CheckboxInputIcon({ checked, disabled = false }: CheckIconProps) {
  return (
    <div
      className={classNames(
        "absolute top-0 right-0 w-6 h-6 m-4",
        disabled && "filter grayscale opacity-50",
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
        "relative border border-solid",
        checked || hasFocus ? "border-dsfr-border-blue" : "border-border-grey",
        checked && hasFocus && "ring-2 ring-blue-500",
        className,
      )}
      role={checkType}
    >
      <input
        type={checkType}
        className="opacity-0! h-6 w-6 absolute top-[19px] right-[19px]"
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
      <label htmlFor={id} className="w-full">
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
