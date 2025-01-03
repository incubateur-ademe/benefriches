export type TRevenue<TSource extends string> = { source: TSource; amount: number };

export type TExpense<TPurpose extends string> = { purpose: TPurpose; amount: number };

export * from "./propertyTaxes";
export * from "./propertyTransferDuties";
