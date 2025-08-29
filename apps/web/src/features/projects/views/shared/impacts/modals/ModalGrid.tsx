import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalGrid = ({ children }: Props) => {
  return <div className="grid grid-cols-1 lg:grid-cols-2">{children}</div>;
};

export default ModalGrid;
