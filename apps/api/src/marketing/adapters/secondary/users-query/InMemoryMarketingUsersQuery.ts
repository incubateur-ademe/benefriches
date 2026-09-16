import {
  MarketingUser,
  MarketingUsersQuery,
} from "src/marketing/core/gateways/MarketingUsersQuery";

type InMemoryMarketingUser = MarketingUser & { createdAt?: Date };

export class InMemoryMarketingUsersQuery implements MarketingUsersQuery {
  private _users: InMemoryMarketingUser[] = [];

  listAll(): Promise<MarketingUser[]> {
    return Promise.resolve(this._users.map(toMarketingUser));
  }

  listCreatedSince(date: Date): Promise<MarketingUser[]> {
    return Promise.resolve(
      this._users
        .filter(
          (user) => user.createdAt !== undefined && user.createdAt.getTime() >= date.getTime(),
        )
        .map(toMarketingUser),
    );
  }

  _setUsers(users: InMemoryMarketingUser[]): void {
    this._users = users;
  }
}

const toMarketingUser = ({ id, email, subscribedToNewsletter }: InMemoryMarketingUser) => ({
  id,
  email,
  subscribedToNewsletter,
});
