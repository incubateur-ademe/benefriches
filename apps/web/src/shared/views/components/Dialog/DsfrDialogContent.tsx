import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useContext } from "react";

import classNames from "../../clsx";
import { DsfrDialogContext } from "./DsfrDialogContext";

type Props = {
  children: ReactNode;
};
const DsfrDialogContent = ({ children }: Props) => {
  const { isOpened } = useContext(DsfrDialogContext);

  return (
    <div className={classNames("px-10", fr.cx("fr-modal__content"))}>{isOpened && children}</div>
  );
};

export default DsfrDialogContent;
