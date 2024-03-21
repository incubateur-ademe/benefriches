import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isTotal?: boolean;
};

const ImpactValue = ({ children, isTotal = false }: Props) => {
  return (
    <div
      style={{
        padding: "0.5rem",
        width: "200px",
        background: "#ECF5FD",
        textAlign: "center",
        fontWeight: isTotal ? "700" : "normal",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactValue;
