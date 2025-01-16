import { getFormattedDuration } from "@/shared/core/dates";

type ScheduleDatesProps = {
  startDateString: string;
  endDateString: string;
};

export default function ScheduleDates({ startDateString, endDateString }: ScheduleDatesProps) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  return (
    <span>
      <strong>
        {startDate.toLocaleDateString()} ➔ {endDate.toLocaleDateString()}
      </strong>{" "}
      <span className="tw-text-nowrap">({getFormattedDuration(startDate, endDate)})</span>
    </span>
  );
}
