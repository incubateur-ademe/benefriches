import { MouseEvent, useState } from "react";

import classNames from "@/shared/views/clsx";

import ImpactRowValue, { ImpactRowValueProps } from "./ImpactRowValue";

type Props = {
  label: string;
  actor?: string;
  value: number;
  onClick?: () => void;
  data?: { label: string; value: number; onClick?: () => void }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
  impactRowValueProps?: Partial<ImpactRowValueProps>;
};

const getFromChildEventPropFunction = (fn?: () => void) => {
  if (!fn) {
    return undefined;
  }

  return (e?: MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation();
    }
    fn();
  };
};

const ImpactItemDetails = ({
  label,
  value,
  actor,
  data,
  type,
  onClick,
  impactRowValueProps,
}: Props) => {
  const hasData = data && data.length > 0;

  const [displayDetails, setDisplayDetails] = useState(false);

  const onToggleAccordion = () => {
    setDisplayDetails((current) => !current);
  };

  const onToggleAccordionFromChild = getFromChildEventPropFunction(onToggleAccordion);

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
        labelProps={{
          onClick: getFromChildEventPropFunction(onClick),
        }}
        onToggleAccordion={hasData ? onToggleAccordionFromChild : undefined}
        {...impactRowValueProps}
      />
      {hasData && displayDetails && (
        <div className={classNames("tw-pl-4")}>
          {data.map(({ label: detailsLabel, value: detailsValue, onClick: detailsOnClick }) => (
            <ImpactRowValue
              value={detailsValue}
              type={type}
              key={detailsLabel}
              label={detailsLabel}
              labelProps={{
                onClick: getFromChildEventPropFunction(detailsOnClick),
              }}
              {...impactRowValueProps}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactItemDetails;
