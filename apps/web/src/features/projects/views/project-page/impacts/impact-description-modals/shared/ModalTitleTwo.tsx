import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitleTwo = ({ children }: Props) => {
  return <h2 className="tw-text-lg tw-my-4">{children}</h2>;
};

export default ModalTitleTwo;
