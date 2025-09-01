import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  isClickable?: boolean;
};

const ImpactItemGroup = ({ children, isClickable = false }: Props) => {
  return (
    <div
      className={classNames(
        "bg-white dark:bg-black",
        "border border-solid border-border-grey dark:border-grey-dark",
        "py-2 px-4",
        "mb-2",
        "rounded-sm",
        "transition",
        isClickable && [
          "transition ease-in-out duration-500",
          "hover:border-grey-dark dark:hover:border-white",
        ],
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
