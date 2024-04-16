import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const ImpactDetailRow = ({ children, onClick }: Props) => {
  return (
    <div
      className={classNames(
        "tw-flex",
        "tw-justify-between",
        "tw-items-center",
        onClick && "tw-cursor-pointer hover:tw-underline",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ImpactDetailRow;
