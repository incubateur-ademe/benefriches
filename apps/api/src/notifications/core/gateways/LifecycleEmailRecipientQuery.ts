export type LifecycleEmailRecipient = {
  id: string;
  email: string;
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
  unsubscribedAt: Date | null;
};

export interface LifecycleEmailRecipientQuery {
  getById(userId: string): Promise<LifecycleEmailRecipient | undefined>;
}
