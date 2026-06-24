import {
  MarketingUser,
  MarketingUsersQuery,
} from "src/marketing/core/gateways/MarketingUsersQuery";

export class InMemoryMarketingUsersQuery implements MarketingUsersQuery {
  private _users: MarketingUser[] = [];

  listAll(): Promise<MarketingUser[]> {
    return Promise.resolve(this._users);
  }

  _setUsers(users: MarketingUser[]): void {
    this._users = users;
  }
}
