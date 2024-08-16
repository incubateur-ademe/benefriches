import { TExpense } from "../financial";

export type PhotovoltaicInstallationExpense = TExpense<
  "technical_studies" | "installation_works" | "other"
>;
