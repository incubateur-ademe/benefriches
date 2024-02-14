import { type ReactNode, useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
  id?: string;
  text?: ReactNode;
};

const TooltipInfoButton = (props: Props) => {
  const reactId = useId();
  const { id = reactId, text } = props;

  return (
    <>
      <button
        type="button"
        className={fr.cx("fr-btn--tooltip", "fr-btn")}
        id={`button-${id}`}
        aria-describedby={`tooltip-${id}`}
      >
        Information contextuelle
      </button>
      <span
        className={fr.cx("fr-tooltip", "fr-placement")}
        id={`tooltip-${id}`}
        role="tooltip"
        aria-hidden="true"
      >
        {text}
      </span>
    </>
  );
};

TooltipInfoButton.displayName = "TooltipInfoButton";

export default TooltipInfoButton;
