import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactDetailRow = ({ children, onClick }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: onClick ? "pointer" : "inherit",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ImpactDetailRow;
