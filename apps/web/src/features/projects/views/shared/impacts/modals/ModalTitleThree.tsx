import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitleThree = ({ children }: Props) => {
  return <h3 className="tw-text-base tw-my-3">{children}</h3>;
};

export default ModalTitleThree;
