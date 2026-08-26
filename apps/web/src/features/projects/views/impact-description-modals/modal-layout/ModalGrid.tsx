import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalGrid = ({ children }: Props) => {
  return <div className="flex flex-col">{children}</div>;
};

export default ModalGrid;
