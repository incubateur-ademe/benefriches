import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

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
