import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import React from "react";

import { noop } from "@/shared/services/noop/noop";

import classNames, { ClassValue } from "../../clsx";

type CheckableTileProps = {
  title: string;
  description?: React.ReactNode;
  imgSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  className?: ClassValue;
  checkType?: "checkbox" | "radio";
};

type NoLabelCheckboxProps = {
  isChecked: boolean;
  disabled: boolean;
};

const NoLabelCheckbox = ({ isChecked, disabled }: NoLabelCheckboxProps) => {
  return (
    <Checkbox
      className="tw-absolute tw-top-4 tw-right-[-8px]"
      options={[
        {
          label: "",
          nativeInputProps: {
            checked: isChecked,
            onChange: noop,
            disabled,
          },
        },
      ]}
    />
  );
};

type NoLabelRadioButtonProps = {
  isChecked: boolean;
  disabled: boolean;
  name: string;
};

const NoLabelRadioButton = ({ isChecked, disabled, name }: NoLabelRadioButtonProps) => {
  return (
    <div className={classNames(fr.cx("fr-radio-group"), "tw-absolute tw-top-4 tw-right-2")}>
      <input
        type="radio"
        disabled={disabled}
        onChange={noop}
        onClick={noop}
        checked={isChecked}
        id={name}
        name={name}
      />
      <label className="tw-h-6 tw-w-6" onClick={noop}>
        {" "}
      </label>
    </div>
  );
};

export default function CheckableTile({
  title,
  description,
  imgSrc,
  isSelected,
  disabled = false,
  onSelect,
  className,
  checkType = "checkbox",
}: CheckableTileProps) {
  const onTileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    // stop event propagation so it is not fired twice when checkbox is clicked
    event.stopPropagation();
    event.preventDefault();
    onSelect();
  };

  const checkComponent =
    checkType === "checkbox" ? (
      <NoLabelCheckbox isChecked={isSelected} disabled={disabled} />
    ) : (
      <NoLabelRadioButton isChecked={isSelected} disabled={disabled} name={title} />
    );

  return (
    <div
      className={classNames(
        className,
        "tw-p-6",
        "tw-border",
        "tw-border-solid",
        "tw-min-h-56",
        "tw-relative",
        "tw-h-full",
        "tw-rounded-lg",
        disabled ? "tw-cursor-not-allowed" : "tw-cursor-pointer",
        isSelected ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
      )}
      onClick={onTileClick}
    >
      <div className="tw-text-center">
        <img
          src={imgSrc}
          width="80px"
          alt={`Illustration pour la tuile ${title}`}
          className={classNames(disabled && "tw-filter tw-grayscale")}
        />
      </div>
      <div className={classNames(fr.cx("fr-mt-1w"), "tw-text-center")}>
        <label
          className={classNames(
            fr.cx("fr-text--lg", "fr-text--bold"),
            disabled && "tw-text-dsfr-greyDisabled",
          )}
          htmlFor={title}
        >
          {title}
        </label>
      </div>
      {description && (
        <div
          className={classNames(
            "tw-text-center",
            disabled && "tw-text-dsfr-greyDisabled",
            fr.cx("fr-mt-1w"),
          )}
        >
          <legend className={fr.cx("fr-text--sm")}>{description}</legend>
        </div>
      )}
      {checkComponent}
    </div>
  );
}
