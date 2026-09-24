import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatAdminDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "-";
  return format(new Date(isoDate), "dd/MM/yyyy HH:mm", { locale: fr });
};

export const formatAdminMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-");
  if (!year || !month) return yearMonth;
  return format(new Date(Number(year), Number(month) - 1, 1), "MMMM yyyy", { locale: fr });
};
