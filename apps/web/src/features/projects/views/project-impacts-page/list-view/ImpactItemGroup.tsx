import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactItemGroup = ({ children }: Props) => {
  return (
    <div
      className={classNames(
        "tw-border-borderGrey",
        "tw-border-0",
        "tw-border-b",
        "tw-border-solid",
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
