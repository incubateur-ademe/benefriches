export type MarketingUser = {
  id: string;
  email: string;
  subscribedToNewsletter: boolean;
};

export interface MarketingUsersQuery {
  listAll(): Promise<MarketingUser[]>;
}
