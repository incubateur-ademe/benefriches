import { ReactNode } from "react";
import ImpactRowValue from "./ImpactRowValue";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  total?: number;
};

const ImpactSectionHeader = ({ title, total }: Props) => {
  return (
    <div className="tw-mt-4">
      <ImpactRowValue value={total} type="monetary" isDark={!!total}>
        <h4
          className={classNames(
            "tw-font-bold",
            "tw-text-lg",
            "tw-py-2",
            "tw-px-4",
            "tw-m-0",
            "tw-w-full",
            "tw-bg-impacts-main",
            "dark:tw-bg-grey-dark",
          )}
        >
          {title}
        </h4>
      </ImpactRowValue>
    </div>
  );
};

export default ImpactSectionHeader;
