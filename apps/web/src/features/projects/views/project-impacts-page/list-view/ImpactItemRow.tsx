import { ReactNode } from "react";

type ImpactItemRowProps = {
  children: ReactNode;
};
const ImpactItemRow = ({ children }: ImpactItemRowProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemRow;
