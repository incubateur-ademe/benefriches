import { ReactNode } from "react";

type ImpactItemRowProps = {
  children: ReactNode;
  isTotal?: boolean;
  onClick?: () => void;
};
const ImpactItemRow = ({ children, onClick, isTotal }: ImpactItemRowProps) => {
  return (
    <div
      onClick={onClick}
      className={onClick ? "tw-cursor-pointer hover:tw-underline" : ""}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: isTotal ? "none" : "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemRow;
