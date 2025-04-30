import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

import ImpactsChartCard, { ChartCardProps } from "./ImpactChartCard";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
} & ChartCardProps;

const ImpactColumnChartCard = ({ title, subtitle, children, dialogId }: Props) => {
  return (
    <ImpactsChartCard dialogId={dialogId}>
      <h3
        className={classNames("tw-text-2xl", !subtitle ? "tw-mb-[calc(4rem + 20px)]" : "tw-mb-2")}
      >
        {title}
      </h3>
      {subtitle && <h4 className="tw-text-sm tw-font-normal tw-mb-2">{subtitle}</h4>}
      <div className="tw-flex tw-flex-col tw-grow tw-justify-between">{children}</div>
    </ImpactsChartCard>
  );
};

export default ImpactColumnChartCard;
