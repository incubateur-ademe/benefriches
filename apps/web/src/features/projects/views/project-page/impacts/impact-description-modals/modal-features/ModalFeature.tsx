import { ReactNode } from "react";

const ModalFeature = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-sm my-1 max-w-3/5 border border-grey-dark border-solid bg-white dark:bg-black dark:border-grey-dark rounded-sm">
      {children}
    </div>
  );
};

export default ModalFeature;
