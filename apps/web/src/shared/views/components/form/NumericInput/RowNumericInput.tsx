import {
  type DetailedHTMLProps,
  forwardRef,
  type InputHTMLAttributes,
  memo,
  ReactNode,
  useId,
} from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

export type RowNumericInputInputProps = {
  className?: string;
  id?: string;
  label: ReactNode;
  imgSrc?: string;
  hintText?: ReactNode;
  hintInputText?: ReactNode;
  hideLabel?: boolean;
  disabled?: boolean;
  state?: "success" | "error" | "default";
  stateRelatedMessage?: ReactNode;
  nativeInputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
};

const RowNumericInput = memo(
  forwardRef<HTMLDivElement, RowNumericInputInputProps>(
    (
      {
        className,
        id,
        label,
        imgSrc,
        hintText,
        hintInputText,
        hideLabel,
        disabled = false,
        state = "default",
        stateRelatedMessage,
        nativeInputProps = {},
        ...rest
      },
      ref,
    ) => {
      const domId = useId();
      const inputId = `input-${id ?? domId}`;
      const messageId = `${inputId}-desc-error`;

      return (
        <div
          className={classNames(
            fr.cx("fr-mb-0", "fr-pt-7v"),
            "tw-flex",
            "tw-justify-between",
            "tw-items-center",
            fr.cx(
              disabled && "fr-input-group--disabled",
              state === "error" && "fr-input-group--error",
              state === "success" && "fr-input-group--valid",
            ),
            className,
          )}
          ref={ref}
          id={id}
          {...rest}
        >
          <div className="tw-flex tw-gap-1 tw-items-center">
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
            <label
              className={classNames(
                "tw-text-lg",
                "tw-font-bold",
                fr.cx("fr-label", hideLabel && "fr-sr-only"),
              )}
              htmlFor={inputId}
            >
              {label}
              {hintText && (
                <span className="fr-hint-text tw-text-sm tw-font-normal">{hintText}</span>
              )}
            </label>
          </div>

          <div className="tw-flex tw-flex-col tw-w-44">
            <input
              {...nativeInputProps}
              className={classNames(
                fr.cx(
                  "fr-input",
                  state === "error" && "fr-input--error",
                  state === "success" && "fr-input--valid",
                ),
              )}
              disabled={disabled}
              aria-describedby={messageId}
              type="number"
              id={inputId}
            />
            {state === "default" && hintInputText && (
              <span className="fr-hint-text tw-mt-1">{hintInputText}</span>
            )}

            {state !== "default" && (
              <p
                id={messageId}
                className={classNames(
                  "tw-mt-0",
                  fr.cx(
                    state === "error" && "fr-error-text",
                    state === "success" && "fr-valid-text",
                  ),
                )}
              >
                {stateRelatedMessage}
              </p>
            )}
          </div>
        </div>
      );
    },
  ),
);

RowNumericInput.displayName = "RowNumericInput";

export default RowNumericInput;
