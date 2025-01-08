import { ReactNode } from "react";

import ModalTitleTwo from "./ModalTitleTwo";

type Props = {
  children: ReactNode;
};

const ModalContent = ({ children }: Props) => {
  return (
    <div className="tw-px-10 tw-pt-4 tw-pb-10">
      <ModalTitleTwo>Qu'est-ce que c'est ?</ModalTitleTwo>
      {children}
    </div>
  );
};

export default ModalContent;
