import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactDetailRow = ({ children }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactDetailRow;
