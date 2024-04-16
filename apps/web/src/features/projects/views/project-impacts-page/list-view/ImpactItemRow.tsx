import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type ImpactItemRowProps = {
  children: ReactNode;
  isTotal?: boolean;
  onClick?: () => void;
};
const ImpactItemRow = ({ children, onClick, isTotal }: ImpactItemRowProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "tw-flex",
        "tw-justify-between",
        "tw-items-center",
        "tw-border-0",
        !isTotal && "tw-border-b",
        "tw-border-grey",
        "tw-border-solid",
        !!onClick && "tw-cursor-pointer hover:tw-underline",
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemRow;
