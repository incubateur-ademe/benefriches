import type { ReactNode } from "react";

import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  className?: ClassValue;
};

const FormStepperWrapper = ({ children, className }: Props) => {
  return (
    <ol role="list" className={classNames("list-none", "p-0", className)}>
      {children}
    </ol>
  );
};

export default FormStepperWrapper;
