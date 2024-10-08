import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitleTwo = ({ children }: Props) => {
  return <h2 className={fr.cx("fr-h5", "fr-my-4v")}>{children}</h2>;
};

export default ModalTitleTwo;
