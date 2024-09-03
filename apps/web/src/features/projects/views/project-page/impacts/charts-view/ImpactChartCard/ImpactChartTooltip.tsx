import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  tooltipId: string;
  rows: {
    label: string;
    value: number;
    valueText: string;
  }[];
};

function ImpactChartTooltip({ tooltipId, rows }: Props) {
  return (
    <span
      className={fr.cx("fr-tooltip", "fr-placement", "fr-placement--top", "fr-text--sm")}
      id={tooltipId}
      role="tooltip"
      aria-hidden="true"
    >
      <div style={{ maxHeight: 200, overflow: "auto" }}>
        {rows.map((row, index) => (
          <div key={row.label} className="tw-flex tw-justify-between tw-items-center  tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              <span
                className="tw-min-h-4 tw-min-w-4 tw-rounded"
                style={{ backgroundColor: `var(--highcharts-color-${index})` }}
              ></span>
              <span>{row.label}</span>
            </div>

            <span
              className={classNames(
                "tw-py-1",
                "tw-pr-4",
                row.value === 0
                  ? "tw-text-impacts-neutral-main dark:tw-text-impacts-neutral-light"
                  : row.value > 0
                    ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                    : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
              )}
            >
              {row.valueText}
            </span>
          </div>
        ))}
      </div>
    </span>
  );
}

export default ImpactChartTooltip;
