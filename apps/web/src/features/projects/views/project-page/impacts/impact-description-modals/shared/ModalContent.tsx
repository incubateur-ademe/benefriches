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
        fullWidth ? "tw-px-6 md:tw-px-[204px]" : "tw-px-6 md:tw-px-10",
        noTitle ? "tw-pt-8" : "tw-pt-4",
        "tw-pb-10",
        "tw-mb-0",
        fr.cx("fr-modal__content"),
        "tw-bg-[var(--background-alt-grey)]",
      )}
    >
      {!noTitle && <ModalTitleTwo>Qu'est-ce que c'est ?</ModalTitleTwo>}
      {children}
    </div>
  );
};

export default ModalContent;
