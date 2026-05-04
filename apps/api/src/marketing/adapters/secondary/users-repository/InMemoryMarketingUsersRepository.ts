import { MarketingUsersRepository } from "src/marketing/core/gateways/MarketingUsersRepository";

export type SubscriptionUpdate = {
  userId: string;
  subscribed: boolean;
};

export class InMemoryMarketingUsersRepository implements MarketingUsersRepository {
  readonly _updates: SubscriptionUpdate[] = [];

  updateSubscriptionStatus(userId: string, subscribed: boolean): Promise<void> {
    this._updates.push({ userId, subscribed });
    return Promise.resolve();
  }
}
