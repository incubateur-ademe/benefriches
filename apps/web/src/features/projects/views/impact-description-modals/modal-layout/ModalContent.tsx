import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import ModalTitleTwo from "./ModalTitleTwo";

type Props = {
  children: ReactNode;
  fullWidth?: boolean;
  noTitle?: boolean;
};

const ModalContent = ({ children, fullWidth = false, noTitle = false }: Props) => {
  return (
    <div
      className={classNames(
        fullWidth ? "px-6 md:px-[204px]" : "px-6 md:px-10",
        noTitle ? "pt-8" : "pt-4",
        "pb-10",
        "mb-0",
        fr.cx("fr-modal__content"),
        "bg-(--background-alt-grey)",
      )}
    >
      {!noTitle && <ModalTitleTwo>Qu'est-ce que c'est ?</ModalTitleTwo>}
      {children}
    </div>
  );
};

export default ModalContent;
