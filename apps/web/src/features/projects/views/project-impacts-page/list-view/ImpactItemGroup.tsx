import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactItemGroup = ({ children, onClick }: Props) => {
  return (
    <div
      className={classNames(
        "tw-border-grey",
        "tw-border-0",
        "tw-border-b",
        "tw-border-solid",
        onClick && "tw-cursor-pointer hover:tw-underline",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
