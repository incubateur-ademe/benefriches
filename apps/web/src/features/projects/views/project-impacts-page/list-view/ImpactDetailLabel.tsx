import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactDetailLabel = ({ children }: Props) => {
  return <div style={{ marginLeft: "1rem", padding: "0.5rem 0" }}>{children}</div>;
};

export default ImpactDetailLabel;
