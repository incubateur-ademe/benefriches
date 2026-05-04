export interface MarketingUsersRepository {
  updateSubscriptionStatus(userId: string, subscribed: boolean): Promise<void>;
}
