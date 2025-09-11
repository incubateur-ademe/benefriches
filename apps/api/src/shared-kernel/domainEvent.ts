export interface DomainEvent<TPayload = Record<string, unknown>> {
  readonly id: string;
  readonly name: string;
  readonly payload: TPayload;
}
