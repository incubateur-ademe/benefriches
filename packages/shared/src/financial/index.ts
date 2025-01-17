export type TRevenue<TSource extends string> = { source: TSource; amount: number };

export type TExpense<TPurpose extends string> = { purpose: TPurpose; amount: number };

export const getRevenueAmountByPurpose = <TRevenues extends TRevenue<string>[]>(
  expenses: TRevenues,
  source: TRevenues[number]["source"],
): number | undefined => {
  return expenses.find((expense) => expense.source === source)?.amount;
};

export * from "./propertyTaxes";
export * from "./propertyTransferDuties";
