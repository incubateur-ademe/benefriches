import React, { useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  description: React.ReactNode;
  imgSrc: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export default function SoilsTransformationProjectRadioOption({
  title,
  description,
  imgSrc,
  checked,
  onChange,
  className,
}: Props) {
  const id = useId();
  return (
    <div
      className={classNames(
        "tw-relative tw-border tw-border-solid",
        checked ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
        className,
      )}
    >
      <input
        type="radio"
        className="tw-invisible tw-absolute"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="tw-cursor-pointer">
        <div className="sm:tw-inline-flex tw-align-top tw-p-6">
          <img
            src={imgSrc}
            width="80px"
            height="80px"
            alt={`Illustration pour l'option ${title}`}
            className="tw-mr-2"
          />
          <div>
            <div className={classNames("tw-mb-2", fr.cx("fr-text--lg", "fr-text--bold"))}>
              {title}
            </div>
            <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>{description}</legend>
          </div>
        </div>
        <div
          className="tw-absolute tw-top-2 tw-right-2 tw-w-full tw-h-10"
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
