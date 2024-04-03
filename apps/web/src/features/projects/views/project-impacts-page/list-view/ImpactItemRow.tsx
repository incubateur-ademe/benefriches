import { ReactNode } from "react";

type ImpactItemRowProps = {
  children: ReactNode;
  onClick?: () => void;
};
const ImpactItemRow = ({ children, onClick }: ImpactItemRowProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #DDDDDD",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemRow;
