export type LifecycleEmailRecipient = {
  id: string;
  email: string;
  unsubscribedAt: Date | null;
};

export interface LifecycleEmailRecipientQuery {
  getById(userId: string): Promise<LifecycleEmailRecipient | undefined>;
}
