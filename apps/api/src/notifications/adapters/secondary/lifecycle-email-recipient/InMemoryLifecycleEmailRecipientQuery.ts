import type {
  LifecycleEmailRecipient,
  LifecycleEmailRecipientQuery,
} from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";

export class InMemoryLifecycleEmailRecipientQuery implements LifecycleEmailRecipientQuery {
  private recipients: LifecycleEmailRecipient[] = [];

  _setRecipients(recipients: LifecycleEmailRecipient[]): void {
    this.recipients = recipients;
  }

  getById(userId: string): Promise<LifecycleEmailRecipient | undefined> {
    return Promise.resolve(this.recipients.find((r) => r.id === userId));
  }
}
