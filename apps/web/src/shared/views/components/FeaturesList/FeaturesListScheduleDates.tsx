import { formatDateFr, getFormattedDuration } from "@/shared/core/dates";

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
        {formatDateFr(startDate)} ➔ {formatDateFr(endDate)}
      </strong>{" "}
      <span className="text-nowrap">({getFormattedDuration(startDate, endDate)})</span>
    </span>
  );
}
