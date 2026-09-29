import type {
  LifecycleEmailDelivery,
  LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";

export interface LifecycleEmailDeliveryQuery {
  // Matches ANY status (pending/sent/failed/abandoned), not just "sent". The unique
  // indexes already make a second row impossible once one exists; the retry sweeper is
  // what re-drives "failed"/stranded "pending" rows. Treating a "failed" row as
  // "not sent" here would make the sender try to insert a duplicate and blow up on
  // the unique index.
  hasDelivery(input: {
    userId: string;
    emailType: LifecycleEmailType;
    relatedEntityId: string | null;
  }): Promise<boolean>;

  // Deliveries the retry sweeper should try again: every "failed" row, plus "pending"
  // rows last attempted strictly before `stalePendingBefore`. Rows of unsubscribed users
  // are left out.
  findRetryCandidates(input: { stalePendingBefore: Date }): Promise<LifecycleEmailDelivery[]>;
}
