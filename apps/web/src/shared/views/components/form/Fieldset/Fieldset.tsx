import { type ReactNode, useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
  id?: string;
  legend?: ReactNode;
  hintText?: ReactNode;
  state?: "success" | "error" | "default";
  stateRelatedMessage?: ReactNode;
  disabled?: boolean;
  name?: string;
  children: ReactNode;
};

const getDefaultId = (name: string, reactId: string) => {
  return `fr-fieldset-radio-${name}-${reactId}`;
};

const Fieldset = (props: Props) => {
  const {
    legend,
    hintText,
    children,
    state = "default",
    stateRelatedMessage,
    disabled = false,
    name: nameProps,
    ...rest
  } = props;
  const reactId = useId();
  const name = nameProps ?? `radio-name-${reactId}`;
  const id = getDefaultId(name, reactId);
  const legendId = `${id}-legend`;

  const errorDescId = `${id}-desc-error`;
  const successDescId = `${id}-desc-valid`;
  const messagesWrapperId = `${id}-messages`;

  return (
    <fieldset
      id={id}
      className={fr.cx(
        "fr-fieldset",
        (() => {
          switch (state) {
            case "default":
              return undefined;
            case "error":
              return "fr-fieldset--error";
            case "success":
              return "fr-fieldset--valid";
          }
        })(),
      )}
      disabled={disabled}
      aria-labelledby={`${legend !== undefined ? legendId : ""}${messagesWrapperId}`}
      role={state === "default" ? undefined : "group"}
      {...rest}
    >
      {legend !== undefined && (
        <legend id={legendId} className={fr.cx("fr-fieldset__legend", "fr-text--regular")}>
          {legend}
          {hintText !== undefined && <span className={"fr-hint-text"}>{hintText}</span>}
        </legend>
      )}
      <div className={"fr-fieldset__content"}>{children}</div>
      <div className={fr.cx("fr-messages-group")} id={messagesWrapperId} aria-live="assertive">
        {stateRelatedMessage !== undefined && (
          <p
            id={(() => {
              switch (state) {
                case "error":
                  return errorDescId;
                case "success":
                  return successDescId;
              }
            })()}
            className={fr.cx(
              "fr-message",
              (() => {
                switch (state) {
                  case "error":
                    return "fr-message--error";
                  case "success":
                    return "fr-message--valid";
                }
              })(),
            )}
          >
            {stateRelatedMessage}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default Fieldset;
