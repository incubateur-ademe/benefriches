import classNames from "@/shared/views/clsx";

type Props = {
  rows: {
    label: string;
    value: number;
    valueText: string;
    color?: string;
  }[];
};

function ImpactChartTooltipContent({ rows }: Props) {
  return (
    <div className="!tw-text-sm">
      {rows.map((row) => (
        <div key={row.label} className="tw-flex tw-justify-between tw-items-center  tw-gap-2">
          <div className="tw-flex tw-items-center tw-gap-2">
            <span
              className="tw-min-h-4 tw-min-w-4 tw-rounded"
              style={row.color ? { backgroundColor: row.color } : {}}
            ></span>
            <span>{row.label}</span>
          </div>

          <span
            className={classNames(
              "tw-py-2",
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
  );
}

export default ImpactChartTooltipContent;
