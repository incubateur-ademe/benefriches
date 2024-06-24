import React, { useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  description: React.ReactNode;
  badgeText: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
};

export default function CreateModeOption({
  title,
  description,
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
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <div className={"sm:tw-inline-flex tw-align-top tw-p-6"}>
          <div className="tw-text-center">
            <div className={classNames("tw-mb-2", fr.cx("fr-text--lg", "fr-text--bold"))}>
              {title}
            </div>
            <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>{description}</legend>
            <Badge
              as="span"
              className="tw-text-sm tw-mt-3 tw-rounded-3xl tw-px-3 tw-normal-case tw-font-normal tw-text-[#297254] tw-bg-[#E3FDEB]"
            >
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
