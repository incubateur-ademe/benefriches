// Write side of the per-user lifecycle email opt-out. The read side is
// LifecycleEmailRecipientQuery, used by LifecycleEmailSender.
export interface LifecycleEmailSubscriptionRepository {
  // Sets users.lifecycle_emails_unsubscribed_at, keeping the first date if already set.
  // Resolves to true when this call recorded the first unsubscribe, false when nothing
  // changed (already unsubscribed, or unknown user).
  markUnsubscribed(userId: string, unsubscribedAt: Date): Promise<boolean>;
}
