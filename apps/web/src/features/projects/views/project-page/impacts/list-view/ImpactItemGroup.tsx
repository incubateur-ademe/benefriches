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
        "tw-bg-white dark:tw-bg-black",
        "tw-border-borderGrey",
        "tw-border",
        "tw-border-solid",
        "tw-py-2",
        "tw-px-4",
        "tw-mb-2",
        "tw-rounded",
        "tw-transition",
        onClick && ["hover:tw-border-black", "hover:tw-scale-x-[1.02]", "hover:tw-cursor-pointer"],
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ImpactItemGroup;
