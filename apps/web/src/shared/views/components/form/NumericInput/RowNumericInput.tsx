import { fr } from "@codegouvfr/react-dsfr";
import { type DetailedHTMLProps, type InputHTMLAttributes, ReactNode, useId } from "react";

import classNames from "@/shared/views/clsx";

type WithAddonProps = {
  state: "error" | "success" | "warning" | "default";
  children: ReactNode;
  addon: ReactNode;
};
const WithAddon = ({ state, children, addon }: WithAddonProps) => {
  return addon ? (
    <div className={fr.cx("fr-input-wrap", "fr-input-wrap--addon")}>
      {children}
      <div
        className={classNames(
          "tw-px-2 tw-pt-[8px]",
          "tw-bg-dsfr-contrastGrey",
          "tw-text-nowrap",
          "tw-border-solid tw-border-0 tw-border-b-2 tw-border-[#000091]",
          state === "error" && "tw-border-dsfr-red",
          state === "success" && "tw-border-dsfr-borderSuccess",
        )}
      >
        {addon}
      </div>
    </div>
  ) : (
    children
  );
};

export type RowNumericInputInputProps = {
  className?: string;
  id?: string;
  label: ReactNode;
  imgSrc?: string;
  hintText?: ReactNode;
  hintInputText?: ReactNode;
  addonText?: ReactNode;
  disabled?: boolean;
  state?: "success" | "error" | "default" | "warning";
  stateRelatedMessage?: ReactNode;
  nativeInputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
};

const RowNumericInput = ({
  className,
  id,
  label,
  imgSrc,
  addonText,
  hintText,
  hintInputText,
  disabled = false,
  state = "default",
  stateRelatedMessage,
  nativeInputProps = {},
}: RowNumericInputInputProps) => {
  const domId = useId();
  const inputId = `input-${id ?? domId}`;
  const messageId = `${inputId}-desc-error`;

  return (
    <div
      className={classNames(
        "tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start",
        "tw-mb-0 tw-pt-7",
        "fr-input-group",
        fr.cx(
          disabled && "fr-input-group--disabled",
          state === "error" && "fr-input-group--error",
          state === "success" && "fr-input-group--valid",
        ),
        state === "warning" && "fr-input-group--info fr-input-group--warning",
        className,
      )}
      id={id}
    >
      <div className="tw-flex tw-gap-2 tw-items-start tw-mb-2 md:tw-mb-0">
        {imgSrc && (
          <img
            src={imgSrc}
            width="60px"
            height="60px"
            aria-hidden="true"
            alt=""
            className={classNames(disabled && "tw-filter tw-grayscale")}
          />
        )}
        <label className={classNames("tw-text-lg", fr.cx("fr-label"))} htmlFor={inputId}>
          {label}
          {hintText && <span className="fr-hint-text tw-text-sm tw-font-normal">{hintText}</span>}
          {state !== "default" && (
            <p
              id={messageId}
              className={classNames(
                "tw-mt-0",
                fr.cx(state === "error" && "fr-error-text", state === "success" && "fr-valid-text"),
                state === "warning" && "fr-info-text fr-warning-text",
              )}
            >
              {stateRelatedMessage}
            </p>
          )}
        </label>
      </div>

      <div className="tw-w-full md:tw-w-44">
        <WithAddon state={state} addon={addonText}>
          <input
            {...nativeInputProps}
            className={classNames(
              "fr-input",
              state === "error" && "fr-input--error",
              state === "success" && "fr-input--valid",
              state === "warning" && "fr-input--warning",
            )}
            disabled={disabled}
            aria-describedby={messageId}
            type="number"
            id={inputId}
          />
        </WithAddon>
        {hintInputText && <span className="fr-hint-text !tw-mt-1">{hintInputText}</span>}
      </div>
    </div>
  );
};

export default RowNumericInput;
