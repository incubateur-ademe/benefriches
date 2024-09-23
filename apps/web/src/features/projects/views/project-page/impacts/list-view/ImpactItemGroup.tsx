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
        "tw-bg-white dark:tw-bg-black",
        "tw-border tw-border-solid tw-border-borderGrey",
        "tw-py-2 tw-px-4",
        "tw-mb-2",
        "tw-rounded",
        "tw-transition",
      )}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
