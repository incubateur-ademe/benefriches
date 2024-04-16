import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactLabel = ({ children }: Props) => {
  return <div className="tw-py-2 tw-font-bold">{children}</div>;
};

export default ImpactLabel;
