import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

const ImpactContainer = ({ children }: { children: ReactNode }) => {
  return (
    <figure
      style={{ border: "2px solid gray", borderRadius: "9px" }}
      className={fr.cx("fr-py-2w", "fr-px-3w", "fr-m-0")}
    >
      {children}
    </figure>
  );
};

export default ImpactContainer;
