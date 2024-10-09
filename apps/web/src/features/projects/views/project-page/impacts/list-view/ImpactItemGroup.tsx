import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  onClick?: () => void;
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
          "hover:tw-border-black hover:dark:tw-border-white",
          "hover:tw-scale-x-[1.02]",
        ],
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
