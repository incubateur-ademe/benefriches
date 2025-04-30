import { MouseEvent, useState } from "react";

import classNames from "@/shared/views/clsx";

import ImpactRowValue, { ImpactRowValueProps } from "./ImpactRowValue";

export type ImpactItemDetailsProps = {
  label: string;
  actor?: string;
  value: number;
  data?: { label: string; value: number; labelProps: ImpactRowValueProps["labelProps"] }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
  impactRowValueProps?: Partial<ImpactRowValueProps>;
  labelProps: ImpactRowValueProps["labelProps"];
};

const getFromChildEventPropFunction = (fn: () => void) => {
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
  labelProps,
  impactRowValueProps,
}: ImpactItemDetailsProps) => {
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
        onToggleAccordion={hasData ? onToggleAccordionFromChild : undefined}
        {...impactRowValueProps}
        labelProps={labelProps}
      />
      {hasData && displayDetails && (
        <div className={classNames("tw-pl-4")}>
          {data.map(({ label: detailsLabel, value: detailsValue, ...rest }) => (
            <ImpactRowValue
              value={detailsValue}
              type={type}
              key={detailsLabel}
              label={detailsLabel}
              {...impactRowValueProps}
              labelProps={rest.labelProps}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactItemDetails;
