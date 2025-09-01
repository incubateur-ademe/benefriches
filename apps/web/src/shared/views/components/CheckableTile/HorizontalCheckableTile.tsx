import { fr } from "@codegouvfr/react-dsfr";
import React, { useId } from "react";

import classNames from "@/shared/views/clsx";

import { getCustomCheckboxStyle, getCustomRadioButtonStyle } from "../CheckboxCard/styles";

type Props = {
  title: string;
  description?: React.ReactNode;
  imgSrc?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  checkType?: "checkbox" | "radio";
};

type CheckIconProps = {
  checked: boolean;
  disabled?: boolean;
  checkType: "checkbox" | "radio";
};

function CheckIcon({ checkType, checked, disabled = false }: CheckIconProps) {
  return (
    <div
      className={classNames("min-w-6 h-6 mr-4", disabled && "filter grayscale opacity-50")}
      style={
        checkType === "radio" ? getCustomRadioButtonStyle(checked) : getCustomCheckboxStyle(checked)
      }
    />
  );
}

export default function HorizontalCheckableTile({
  title,
  description,
  imgSrc,
  checked,
  onChange,
  disabled = false,
  checkType = "radio",
}: Props) {
  const id = useId();
  return (
    <div
      className={classNames(
        "relative border border-solid rounded-lg h-full",
        checked ? "border-dsfr-border-blue" : "border-border-grey",
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
      />
      <label htmlFor={id} className="w-full">
        <div className="p-4 flex items-center">
          <CheckIcon checkType={checkType} checked={checked} disabled={disabled} />
          {imgSrc && (
            <img
              src={imgSrc}
              width="80px"
              height="80px"
              alt=""
              aria-hidden="true"
              className={classNames("mr-4", disabled && "filter grayscale opacity-50")}
            />
          )}
          <div>
            <div
              className={classNames(
                description ? "mb-1" : "mb-0",
                fr.cx("fr-text--lg", "fr-text--bold"),
              )}
            >
              {title}
            </div>
            {description && (
              <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>{description}</legend>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
