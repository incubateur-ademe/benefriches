import type { ReactNode } from "react";

import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  className?: ClassValue;
  noPadding?: boolean;
};

const ModalData = ({ children, className, noPadding }: Props) => {
  return (
    <div
      className={classNames(
        "grid grid-cols-1 lg:grid-cols-2 gap-10",
        !noPadding && "p-6 md:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ModalData;
