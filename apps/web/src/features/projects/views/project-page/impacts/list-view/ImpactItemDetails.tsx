import { ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

import ImpactRowLabel from "./ImpactRowLabel";
import ImpactRowValue from "./ImpactRowValue";

type Props = {
  label?: ReactNode;
  actor?: string;
  value: number;
  onClick?: () => void;
  data?: { label: string; value: number; onClick?: () => void }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const ImpactItemDetails = ({ label, value, actor, data, type, onClick }: Props) => {
  const [displayDetails, setDisplayDetails] = useState(true);

  const onToggleAccordion = () => {
    setDisplayDetails((current) => !current);
  };

  const hasData = data && data.length > 0;

  return (
    <>
      <ImpactRowValue
        value={value}
        type={type}
        isTotal
        isAccordionOpened={displayDetails}
        onToggleAccordion={hasData ? onToggleAccordion : undefined}
      >
        <div className="tw-grid lg:tw-grid-cols-5 tw-w-full tw-items-center">
          {label && (
            <span className={classNames("lg:tw-col-start-1", "lg:tw-col-end-5")}>
              <ImpactRowLabel isTotal onLabelClick={onClick}>
                {label}
              </ImpactRowLabel>
            </span>
          )}
          {actor && <span className={classNames("lg:tw-col-start-5")}>{actor}</span>}
        </div>
      </ImpactRowValue>
      {hasData && displayDetails && (
        <div className={classNames("tw-pl-4")}>
          {data.map(({ label: detailsLabel, value: detailsValue, onClick: onDetailsClick }) => (
            <ImpactRowValue value={detailsValue} type={type} key={detailsLabel}>
              <ImpactRowLabel onLabelClick={onDetailsClick}>{detailsLabel}</ImpactRowLabel>
            </ImpactRowValue>
          ))}
        </div>
      )}
    </>
  );
};

export default ImpactItemDetails;
