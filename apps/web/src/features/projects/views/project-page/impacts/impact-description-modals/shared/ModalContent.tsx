import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import ModalTitleTwo from "./ModalTitleTwo";

type Props = {
  children: ReactNode;
};

const ModalContent = ({ children }: Props) => {
  return (
    <div className={classNames("tw-px-10 tw-pt-4 tw-pb-10 tw-mb-0", fr.cx("fr-modal__content"))}>
      <ModalTitleTwo>Qu'est-ce que c'est ?</ModalTitleTwo>
      {children}
    </div>
  );
};

export default ModalContent;
