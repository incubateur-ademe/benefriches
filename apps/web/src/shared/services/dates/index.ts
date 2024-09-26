import { formatDuration, interval, intervalToDuration } from "date-fns";
import { fr } from "date-fns/locale";

export const getFormattedDuration = (startDate: Date, endDate: Date) => {
  const duration = intervalToDuration(interval(new Date(startDate), new Date(endDate)));
  return formatDuration(duration, {
    format: ["years", "months"],
    locale: fr,
    delimiter: " et ",
  });
};
