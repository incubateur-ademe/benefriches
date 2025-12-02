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
          "px-2 pt-2",
          "bg-dsfr-contrast-grey",
          "text-nowrap",
          "border-solid border-0 border-b-2 border-(--border-action-high-blue-france)",
          state === "error" && "border-dsfr-red",
          state === "success" && "border-dsfr-border-success",
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
        "flex flex-col md:flex-row justify-between items-start",
        "pt-4",
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
      <div className="flex gap-2 items-start mb-2 md:mb-0">
        {imgSrc && (
          <img
            src={imgSrc}
            width="60px"
            height="60px"
            aria-hidden="true"
            alt=""
            className={classNames(disabled && "filter grayscale")}
          />
        )}
        <label className={classNames("text-lg", fr.cx("fr-label"))} htmlFor={inputId}>
          {label}
          {hintText && <span className="fr-hint-text text-sm font-normal">{hintText}</span>}
          {state !== "default" && (
            <p
              id={messageId}
              className={classNames(
                "mt-0",
                fr.cx(state === "error" && "fr-error-text", state === "success" && "fr-valid-text"),
                state === "warning" && "fr-info-text fr-warning-text",
              )}
            >
              {stateRelatedMessage}
            </p>
          )}
        </label>
      </div>

      <div className="w-full md:w-44">
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
            type="text"
            id={inputId}
            inputMode="numeric"
            pattern="[0-9]*[.,]?[0-9]+"
          />
        </WithAddon>
        {hintInputText && <span className="fr-hint-text mt-1!">{hintInputText}</span>}
      </div>
    </div>
  );
};

export default RowNumericInput;
