import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactItemGroup = ({ children, onClick }: Props) => {
  return (
    <div
      className={onClick ? "tw-cursor-pointer hover:tw-underline" : ""}
      onClick={onClick}
      style={{
        borderBottom: "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
