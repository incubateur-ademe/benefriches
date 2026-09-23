import type { ReactNode } from "react";

import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  className?: ClassValue;
};

const ModalData = ({ children, className }: Props) => {
  return (
    <div className={classNames("p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10", className)}>
      {children}
    </div>
  );
};

export default ModalData;
