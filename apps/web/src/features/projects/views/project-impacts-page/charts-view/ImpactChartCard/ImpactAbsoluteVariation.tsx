import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  children: ReactNode;
};

export default function ImpactAbsoluteVariation({ children }: Props) {
  return (
    <div className={fr.cx("fr-text--sm", "fr-m-0")} style={{ textAlign: "center" }}>
      {children}
    </div>
  );
}
