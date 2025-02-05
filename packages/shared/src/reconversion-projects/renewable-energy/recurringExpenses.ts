import { TExpense } from "../../financial";

type RecurringExpensePurpose = "rent" | "maintenance" | "taxes" | "other";

export type RecurringExpense = TExpense<RecurringExpensePurpose>;
