export type ExtractDetailsKeyName<
  T extends { keyName: string; details?: readonly { keyName: string }[] },
  N extends T["keyName"],
> = Extract<T, { keyName: N }>["details"] extends readonly { keyName: infer K }[] ? K : never;
