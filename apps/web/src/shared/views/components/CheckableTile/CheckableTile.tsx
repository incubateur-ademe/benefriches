import { fr } from "@codegouvfr/react-dsfr";
import React, { useId } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  description?: React.ReactNode;
  imgSrc: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  checkType?: "checkbox" | "radio";
};

function RadioInputIcon({ checked, disabled = false }: { checked: boolean; disabled?: boolean }) {
  return (
    <div
      className={classNames(
        "tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-12",
        disabled && "tw-filter tw-grayscale tw-opacity-50",
      )}
      style={{
        backgroundSize: "1.875rem 1.875rem",
        backgroundImage: checked
          ? `radial-gradient(transparent 10px, var(--border-active-blue-france) 11px, transparent 12px), radial-gradient(var(--background-active-blue-france) 5px, transparent 6px)`
          : `radial-gradient(transparent 10px, var(--border-action-high-blue-france) 11px, transparent 12px)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top 16px right 16px",
      }}
    />
  );
}

function CheckboxInputIcon({
  checked,
  disabled = false,
}: {
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={classNames(
        "tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-12 tw-m-4",
        disabled && "tw-filter tw-grayscale tw-opacity-50",
      )}
      style={{
        width: "1.5rem",
        height: "1.5rem",
        borderRadius: "0.25rem",
        backgroundSize:
          "0.25rem 0.25rem, calc(100% - 0.25rem) 1px, 0.25rem 0.25rem, 1px calc(100% - 0.5rem), 0.25rem 0.25rem, calc(100% - 0.5rem) 1px, 0.25rem 0.25rem, 1px calc(100% - 0.5rem), 1rem",
        backgroundPosition:
          "0 0, 0.25rem 0, 100% 0, 0 0.25rem, 100% 100%, calc(100% - 0.25rem) 100%, 0 100%, 100% 0.25rem, center",
        backgroundRepeat: "no-repeat",
        backgroundColor: checked ? "var(--background-active-blue-france)" : "initial",
        backgroundImage: checked
          ? `radial-gradient(at 5px 4px, transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at calc(100% - 5px) 4px, transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at calc(100% - 5px) calc(100% - 4px), transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at 5px calc(100% - 4px), transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23f5f5fe' d='M10 15.17l9.2-9.2 1.4 1.42L10 18l-6.36-6.36 1.4-1.42z'/></svg>")`
          : "radial-gradient(at 5px 4px, transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at calc(100% - 5px) 4px, transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at calc(100% - 5px) calc(100% - 4px), transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at 5px calc(100% - 4px), transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france))",
      }}
    />
  );
}

export default function CheckableTile({
  title,
  description,
  imgSrc,
  checked,
  onChange,
  className,
  disabled = false,
  checkType = "radio",
}: Props) {
  const id = useId();
  return (
    <div
      className={classNames(
        "tw-relative tw-border tw-border-solid tw-rounded-lg tw-h-full",
        checked ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
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
