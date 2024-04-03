import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactItemGroup = ({ children, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      style={{
        borderBottom: "1px solid #DDDDDD",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
