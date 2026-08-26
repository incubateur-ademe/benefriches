import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  isClickable?: boolean;
  className?: ClassValue;
};

const ImpactItemGroup = ({ children, isClickable = false, className }: Props) => {
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
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
