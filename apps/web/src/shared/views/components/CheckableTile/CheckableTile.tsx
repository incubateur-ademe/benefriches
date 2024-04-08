import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import { noop } from "@/shared/services/noop/noop";

type CheckableTileProps = {
  title: string;
  description?: React.ReactNode;
  imgSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  checkType?: "checkbox" | "radio";
};

type NoLabelCheckboxProps = {
  isChecked: boolean;
  disabled: boolean;
};

const NoLabelCheckbox = ({ isChecked, disabled }: NoLabelCheckboxProps) => {
  return (
    <Checkbox
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
    <div className={fr.cx("fr-radio-group")}>
      <input
        type="radio"
        disabled={disabled}
        onChange={noop}
        onClick={noop}
        checked={isChecked}
        id={name}
        name={name}
        style={{ position: "absolute", top: "16px", right: "0" }}
      />
      <label style={{ width: "24px", height: "24px" }} onClick={noop}>
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
  style,
  checkType = "checkbox",
}: CheckableTileProps) {
  const tileStyle = {
    border: `1px solid ${isSelected ? "#000091" : "#DDD"}`,
    minHeight: "240px",
    cursor: disabled ? "not-allowed" : "pointer",
    position: "relative",
    ...style,
  } as const;

  const titleStyle = { color: disabled ? "#929292" : "inherit" } as const;

  const descriptionStyle = {
    textAlign: "center",
    color: disabled ? "#929292" : "inherit",
  } as const;

  const imgStyle = { filter: disabled ? "grayScale(100%)" : "none" } as const;

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
    <div className={fr.cx("fr-py-2w", "fr-px-3w")} style={tileStyle} onClick={onTileClick}>
      <div style={{ textAlign: "center" }}>
        <img
          src={imgSrc}
          width="80px"
          alt={`Illustration pour la tuile ${title}`}
          style={imgStyle}
        />
      </div>
      <div className={fr.cx("fr-mt-1w")} style={{ textAlign: "center" }}>
        <label className={fr.cx("fr-text--lg", "fr-text--bold")} style={titleStyle} htmlFor={title}>
          {title}
        </label>
      </div>
      {description && (
        <div className={fr.cx("fr-mt-1w")} style={descriptionStyle}>
          <legend className={fr.cx("fr-text--sm")}>{description}</legend>
        </div>
      )}
      <div style={{ position: "absolute", top: "16px", right: "0" }}>{checkComponent}</div>
    </div>
  );
}
