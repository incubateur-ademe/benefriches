import { CSSProperties } from "react";

import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import "./ModalColumnChartTooltip.css";

type Props = {
  position?: {
    left: number;
    top: number;
    width: number;
    adjustArrowX: number;
  };
  category?: string;
  rows?: {
    label: string;
    value: number;
    valueText: string;
    color?: string;
  }[];
};

function ModalColumnChartTooltip({ rows, position, category }: Props) {
  if (!position || !rows || rows.length === 0) {
    return null;
  }

  return (
    <span
      role="tooltip"
      className="fr-tooltip-without-placement-modal-impacts"
      style={
        {
          transform: "translateY(-100%)",
          "--adjust-arrow-x": `${position.adjustArrowX}px`,
          left: position.left,
          top: position.top,
          width: position.width,
        } as CSSProperties
      }
    >
      {category && <strong className="text-sm">{category}</strong>}
      <div className="!text-xs">
        {rows.map((row) => (
          <div key={row.label} className="py-1 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className="min-h-3 min-w-3 rounded"
                style={row.color ? { backgroundColor: row.color } : {}}
              ></span>
              <span>{row.label}</span>
            </div>

            <span className={getPositiveNegativeTextClassesFromValue(row.value)}>
              {row.valueText}
            </span>
          </div>
        ))}
      </div>
    </span>
  );
}

export default ModalColumnChartTooltip;
