export type MarketingUser = {
  id: string;
  email: string;
  subscribedToNewsletter: boolean;
};

export interface MarketingUsersQuery {
  listAll(): Promise<MarketingUser[]>;
  /** Users whose account was created at or after `date` (inclusive), ordered by creation date. */
  listCreatedSince(date: Date): Promise<MarketingUser[]>;
}
