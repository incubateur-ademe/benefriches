import { ReactNode } from "react";

import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import { formatMonetaryImpact } from "../shared/formatImpactValue";

type Props = {
  title: string;
  subtitle?: string;
  total: number;
  chart: ReactNode;
};

export default function ProjectBreakEvenLevelSection({ total, chart, title, subtitle }: Props) {
  return (
    <div className="grid md:grid-cols-8 gap-8">
      <div className="md:col-span-2">
        <span
          className={classNames(
            `fr-badge`,
            "text-[32px]",
            "px-3",
            "py-4",
            "mb-4",
            getPositiveNegativeTextClassesFromValue(total),
          )}
        >
          {formatMonetaryImpact(total)}
        </span>

        <h4 className="mb-4">{title}</h4>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="md:col-start-3 md:col-span-6">{chart}</div>
    </div>
  );
}
