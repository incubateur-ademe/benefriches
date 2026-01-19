import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  children: ReactNode;
};
const DsfrDialogContent = ({ children }: Props) => {
  return <div className={classNames("px-10", fr.cx("fr-modal__content"))}>{children}</div>;
};

export default DsfrDialogContent;
