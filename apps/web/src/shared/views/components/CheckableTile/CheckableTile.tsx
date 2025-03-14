import { fr } from "@codegouvfr/react-dsfr";
import React, { useId } from "react";

import classNames from "@/shared/views/clsx";

import { getCustomCheckboxStyle, getCustomRadioButtonStyle } from "./styles";

type Props = {
  title: string;
  description?: React.ReactNode;
  imgSrc: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  checkType?: "checkbox" | "radio";
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

export default function CheckableTile({
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
        <div className="tw-p-6">
          <div className="tw-text-center">
            {imgSrc && (
              <img
                src={imgSrc}
                width="80px"
                height="80px"
                alt={`Illustration pour la tuile "${title}"`}
                className={disabled ? "tw-filter tw-grayscale tw-opacity-50 tw-mb-2" : "tw-mb-2"}
              />
            )}
            <div
              className={classNames(
                "tw-mb-2",
                !imgSrc && "tw-mt-6",
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
        {checkType === "radio" ? (
          <RadioInputIcon checked={checked} disabled={disabled} />
        ) : (
          <CheckboxInputIcon checked={checked} disabled={disabled} />
        )}
      </label>
    </div>
  );
}
