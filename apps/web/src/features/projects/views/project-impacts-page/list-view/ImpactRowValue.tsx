import { ReactNode } from "react";
import ImpactValue from "./ImpactValue";

import classNames from "@/shared/views/clsx";

type Props = {
  value?: number;
  isDark?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: "surfaceArea" | "monetary" | "co2" | "default" | undefined;
};

const ImpactRowValue = ({ value, children, type, onClick, isDark }: Props) => {
  return (
    <div
      className={classNames(
        "tw-grid",
        "tw-grid-cols-[1fr_12rem]",
        !!onClick && "tw-cursor-pointer hover:tw-underline",
      )}
      onClick={onClick}
    >
      {children}

      <div
        aria-hidden={!value}
        className={classNames(
          "tw-p-2",
          "tw-flex",
          "tw-items-center",
          "tw-justify-center",
          isDark
            ? "tw-bg-impacts-dark dark:tw-bg-dsfr-contrastGrey"
            : "tw-bg-impacts-main dark:tw-bg-grey-dark",
        )}
      >
        {value && <ImpactValue isTotal value={value} type={type} />}
      </div>
    </div>
  );
};

export default ImpactRowValue;
