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
      className={classNames(
        "tw-min-w-6 tw-h-6 tw-mr-4",
        disabled && "tw-filter tw-grayscale tw-opacity-50",
      )}
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
        "tw-relative tw-border tw-border-solid tw-rounded-lg tw-h-full",
        checked ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
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
      />
      <label htmlFor={id} className="tw-w-full">
        <div className="tw-p-4 tw-flex tw-items-center">
          <CheckIcon checkType={checkType} checked={checked} disabled={disabled} />
          {imgSrc && (
            <img
              src={imgSrc}
              width="80px"
              height="80px"
              alt={`Illustration pour la tuile "${title}"`}
              className={classNames("tw-mr-4", disabled && "tw-filter tw-grayscale tw-opacity-50")}
            />
          )}
          <div>
            <div
              className={classNames(
                description ? "tw-mb-1" : "tw-mb-0",
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
