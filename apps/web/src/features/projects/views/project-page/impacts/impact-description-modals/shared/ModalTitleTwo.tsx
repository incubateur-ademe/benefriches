import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  children: ReactNode;
};

const ModalTitleTwo = ({ children }: Props) => {
  return <h2 className={fr.cx("fr-h5", "fr-my-4v")}>{children}</h2>;
};

export default ModalTitleTwo;
