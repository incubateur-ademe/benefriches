import { ReactNode } from "react";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactRowValue from "./ImpactRowValue";

import classNames from "@/shared/views/clsx";

type Props = {
  label: ReactNode;
  value: number;
  isTotal?: boolean;
  onClick?: () => void;
  data?: { label: string; value: number; onClick?: () => void }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const ImpactItem = ({ label, value, data, type, onClick, isTotal }: Props) => {
  return (
    <ImpactItemGroup>
      <ImpactRowValue value={value} type={type} onClick={onClick}>
        <span
          className={classNames("tw-flex", "tw-items-center", isTotal && "tw-py-4 tw-font-bold")}
        >
          {label}
        </span>
      </ImpactRowValue>
      {data && (
        <div
          className={classNames(
            "before:tw-content-['']",
            "before:tw-h-[90%]",
            "before:tw-w-px",
            "before:tw-absolute",
            "before:tw-bottom-[5%]",
            "before:tw-left-0",
            "before:tw-bg-impacts-neutral-main",
            "tw-relative",
            "tw-pl-2",
          )}
        >
          {data.map(({ label: detailsLabel, value: detailsValue, onClick: detailsOnClick }) => (
            <ImpactRowValue
              onClick={detailsOnClick}
              value={detailsValue}
              type={type}
              key={detailsLabel}
            >
              <span className="tw-ml-4 tw-py-2">{detailsLabel}</span>
            </ImpactRowValue>
          ))}
        </div>
      )}
    </ImpactItemGroup>
  );
};

export default ImpactItem;
