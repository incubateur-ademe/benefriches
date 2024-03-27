import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  children: ReactNode;
};

const ImpactSectionTitle = ({ children }: Props) => {
  return <h4 className={fr.cx("fr-summary__title", "fr-mb-0")}>{children}</h4>;
};

export default ImpactSectionTitle;
