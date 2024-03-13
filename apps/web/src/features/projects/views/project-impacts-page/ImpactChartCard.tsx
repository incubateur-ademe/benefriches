import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  title: ReactNode;
  children?: ReactNode;
};

const ImpactCard = ({ title, children }: Props) => {
  return (
    <figure
      style={{ border: "1px solid #DDDDDD", background: "#ECF5FD" }}
      className={fr.cx("fr-py-2w", "fr-px-3w", "fr-m-0")}
    >
      <strong>{title}</strong>
      {children}
    </figure>
  );
};

export default ImpactCard;
