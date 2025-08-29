import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitleThree = ({ children }: Props) => {
  return <h3 className="text-base my-3">{children}</h3>;
};

export default ModalTitleThree;
