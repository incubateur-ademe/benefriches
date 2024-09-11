import React, { useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  title: string;
  description: React.ReactNode;
  badgeText: string;
  imgSrc: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
};

export default function CreateModeOption({
  title,
  description,
  imgSrc,
  checked,
  onChange,
  className,
  badgeText,
  disabled = false,
}: Props) {
  const id = useId();
  return (
    <div
      className={classNames(
        "tw-relative tw-border tw-border-solid tw-rounded-lg",
        checked ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
        className,
      )}
    >
      <input
        type="radio"
        className="tw-invisible tw-absolute"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <div className={"sm:tw-inline-flex tw-align-top tw-p-6"}>
          <div className="tw-text-center">
            <img
              src={imgSrc}
              width="80px"
              height="80px"
              alt={`Illustration pour l'option ${title}`}
              className={disabled ? "tw-filter tw-grayscale tw-opacity-50 tw-mb-2" : "tw-mb-2"}
            />
            <div className={classNames("tw-mb-2", fr.cx("fr-text--lg", "fr-text--bold"))}>
              {title}
            </div>
            <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>{description}</legend>
            <Badge className="tw-mt-3" style={disabled ? "disabled" : "green-tilleul"}>
              {badgeText}
            </Badge>
          </div>
        </div>
        <div
          className={classNames(
            "tw-absolute tw-top-2 tw-right-2 tw-w-full tw-h-10",
            disabled && "tw-filter tw-grayscale tw-opacity-50",
          )}
          style={{
            backgroundSize: "1.875rem 1.875rem, 1.875rem 1.875rem",
            backgroundImage: checked
              ? `radial-gradient(transparent 10px, var(--border-active-blue-france) 11px, transparent 12px), radial-gradient(var(--background-active-blue-france) 5px, transparent 6px)`
              : `radial-gradient(transparent 10px, var(--border-action-high-blue-france) 11px, transparent 12px)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top 8px right 8px",
          }}
        />
      </label>
    </div>
  );
}
