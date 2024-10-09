import { MouseEvent, ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

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
  const hasData = data && data.length > 0;

  const [displayDetails, setDisplayDetails] = useState(false);

  const onToggleAccordion = () => {
    setDisplayDetails((current) => !current);
  };

  const onToggleAccordionFromChild = (e?: MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation();
    }
    onToggleAccordion();
  };

  return (
    <div
      onClick={hasData ? onToggleAccordion : undefined}
      className={classNames(hasData && "tw-cursor-pointer")}
    >
      <ImpactRowValue
        label={label}
        actor={actor}
        value={value}
        type={type}
        isTotal
        isAccordionOpened={displayDetails}
        onLabelClick={
          onClick
            ? (e?: MouseEvent<HTMLElement>) => {
                if (e) {
                  e.stopPropagation();
                }
                onClick();
              }
            : undefined
        }
        onToggleAccordion={hasData ? onToggleAccordionFromChild : undefined}
      />
      {hasData && displayDetails && (
        <div className={classNames("tw-pl-4")}>
          {data.map(({ label: detailsLabel, value: detailsValue, onClick: onDetailsClick }) => (
            <ImpactRowValue
              value={detailsValue}
              type={type}
              key={detailsLabel}
              label={detailsLabel}
              onLabelClick={
                onDetailsClick
                  ? (e?: MouseEvent<HTMLElement>) => {
                      if (e) {
                        e.stopPropagation();
                      }
                      onDetailsClick();
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactItemDetails;
