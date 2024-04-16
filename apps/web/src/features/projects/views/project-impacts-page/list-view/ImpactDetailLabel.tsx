import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactDetailLabel = ({ children }: Props) => {
  return <div className="tw-ml-4 tw-py-2">{children}</div>;
};

export default ImpactDetailLabel;
