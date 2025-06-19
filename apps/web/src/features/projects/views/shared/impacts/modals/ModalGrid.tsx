import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalGrid = ({ children }: Props) => {
  return <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2">{children}</div>;
};

export default ModalGrid;
