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
        "tw-bg-white dark:tw-bg-black",
        "tw-border tw-border-solid tw-border-borderGrey dark:tw-border-grey-dark",
        "tw-py-2 tw-px-4",
        "tw-mb-2",
        "tw-rounded",
        "tw-transition",
        isClickable && [
          "tw-transition tw-ease-in-out tw-duration-500",
          "hover:tw-border-grey-dark hover:dark:tw-border-white",
        ],
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
