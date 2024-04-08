import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactDetailRow = ({ children, onClick }: Props) => {
  return (
    <div
      className={onClick ? "tw-cursor-pointer hover:tw-underline" : ""}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ImpactDetailRow;
