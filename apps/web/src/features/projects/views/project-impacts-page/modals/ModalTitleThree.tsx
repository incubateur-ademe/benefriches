import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  children: ReactNode;
};

const ModalTitleThree = ({ children }: Props) => {
  return <h3 className={fr.cx("fr-h6", "fr-my-3v")}>{children}</h3>;
};

export default ModalTitleThree;
