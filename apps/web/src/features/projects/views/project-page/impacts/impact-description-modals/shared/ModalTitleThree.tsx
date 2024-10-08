import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitleThree = ({ children }: Props) => {
  return <h3 className={fr.cx("fr-h6", "fr-my-3v")}>{children}</h3>;
};

export default ModalTitleThree;
