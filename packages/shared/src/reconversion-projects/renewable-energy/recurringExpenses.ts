import { TExpense } from "../../financial";

export type RecurringExpensePurpose = "rent" | "maintenance" | "taxes" | "other";

export type RecurringExpense = TExpense<RecurringExpensePurpose>;
