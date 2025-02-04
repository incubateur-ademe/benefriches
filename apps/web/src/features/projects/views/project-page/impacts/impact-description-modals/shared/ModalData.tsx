import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  className?: ClassValue;
};

const ModalData = ({ children, className }: Props) => {
  return <div className={classNames("tw-p-6 md:tw-p-10", className)}>{children}</div>;
};

export default ModalData;
