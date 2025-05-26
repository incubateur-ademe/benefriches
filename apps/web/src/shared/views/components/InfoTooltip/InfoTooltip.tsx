import { fr } from "@codegouvfr/react-dsfr";
import { useId } from "react";

type Props = {
  title: string;
};

const InfoTooltip = ({ title }: Props) => {
  const id = useId();

  return (
    <>
      <i
        className={fr.cx("fr-icon--sm", "fr-icon-information-line", "fr-pl-2v")}
        style={{ color: fr.colors.decisions.text.title.grey.default }}
        aria-describedby={id}
        id={`tooltip-owner-${id}`}
      ></i>
      <span
        className={fr.cx("fr-tooltip", "fr-placement")}
        id={id}
        role="tooltip"
        aria-hidden="true"
      >
        {title}
      </span>
    </>
  );
};

export default InfoTooltip;
