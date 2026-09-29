export interface LifecycleEmailsGateway {
  // Throws an Error whose message is the API error code (e.g. "INVALID_UNSUBSCRIBE_TOKEN").
  unsubscribe(token: string): Promise<void>;
}
