export interface DomainEvent<TName = string, TPayload = Record<string, unknown>> {
  readonly id: string;
  readonly name: TName;
  readonly payload: TPayload;
}
