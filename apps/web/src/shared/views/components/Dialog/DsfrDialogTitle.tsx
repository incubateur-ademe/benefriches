import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useContext } from "react";

import { DsfrDialogContext } from "./DsfrDialogContext";

type Props = {
  children: ReactNode;
};
const DsfrDialogTitle = ({ children }: Props) => {
  const { dialogTitleId } = useContext(DsfrDialogContext);
  return (
    <h2 className={fr.cx("fr-modal__title")} id={dialogTitleId}>
      {children}
    </h2>
  );
};

export default DsfrDialogTitle;
