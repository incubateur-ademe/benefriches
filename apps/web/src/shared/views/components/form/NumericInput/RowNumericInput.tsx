import { fr } from "@codegouvfr/react-dsfr";
import {
  type DetailedHTMLProps,
  forwardRef,
  type InputHTMLAttributes,
  memo,
  ReactNode,
  useId,
} from "react";

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
  state?: "success" | "error" | "default" | "warning";
  stateRelatedMessage?: ReactNode;
  nativeInputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
};

const RowNumericInput = memo(
  forwardRef<HTMLDivElement, RowNumericInputInputProps>(
    function BaseRowNumericInput(baseProps, ref) {
      // props are not destructured nor named 'props' here because of an issue with eslint-plugin-react when using forwardRef
      // see https://github.com/jsx-eslint/eslint-plugin-react/issues/3796
      const {
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
      } = baseProps;
      const domId = useId();
      const inputId = `input-${id ?? domId}`;
      const messageId = `${inputId}-desc-error`;

      return (
        <div
          className={classNames(
            "tw-flex",
            "tw-justify-between",
            "tw-items-start",
            "tw-mb-0",
            "tw-pt-7",
            "fr-input-group",
            fr.cx(
              disabled && "fr-input-group--disabled",
              state === "error" && "fr-input-group--error",
              state === "success" && "fr-input-group--valid",
            ),
            state === "warning" && "fr-input-group--info fr-input-group--warning",
            className,
          )}
          ref={ref}
          id={id}
          {...rest}
        >
          <div className="tw-flex tw-gap-2 tw-items-start">
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
              className={classNames("tw-text-lg", fr.cx("fr-label", hideLabel && "fr-sr-only"))}
              htmlFor={inputId}
            >
              {label}
              {hintText && (
                <span className="fr-hint-text tw-text-sm tw-font-normal">{hintText}</span>
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
                    state === "warning" && "fr-info-text fr-warning-text",
                  )}
                >
                  {stateRelatedMessage}
                </p>
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
                state === "warning" && "fr-input--warning",
              )}
              disabled={disabled}
              aria-describedby={messageId}
              type="number"
              id={inputId}
            />
            {hintInputText && <span className="fr-hint-text tw-mt-1">{hintInputText}</span>}
          </div>
        </div>
      );
    },
  ),
);

export default RowNumericInput;
