import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactLabel = ({ children }: Props) => {
  return <div style={{ padding: "0.5rem 0", fontWeight: "700" }}>{children}</div>;
};

export default ImpactLabel;
