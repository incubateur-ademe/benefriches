import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ImpactItemGroup = ({ children }: Props) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
