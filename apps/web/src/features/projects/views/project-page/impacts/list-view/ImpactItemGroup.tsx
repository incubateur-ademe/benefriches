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
        "border border-solid border-borderGrey dark:border-grey-dark",
        "py-2 px-4",
        "mb-2",
        "rounded",
        "transition",
        isClickable && [
          "transition ease-in-out duration-500",
          "hover:border-grey-dark hover:dark:border-white",
        ],
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
