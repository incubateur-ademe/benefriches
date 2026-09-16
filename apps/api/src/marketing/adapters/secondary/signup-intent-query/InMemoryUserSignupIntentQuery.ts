import type {
  UserSignupIntent,
  UserSignupIntentQuery,
} from "src/marketing/core/gateways/UserSignupIntentQuery";

export class InMemoryUserSignupIntentQuery implements UserSignupIntentQuery {
  readonly _intents = new Map<string, UserSignupIntent>();

  findByUserId(userId: string): Promise<UserSignupIntent | null> {
    return Promise.resolve(this._intents.get(userId) ?? null);
  }

  _setIntent(userId: string, intent: UserSignupIntent): void {
    this._intents.set(userId, intent);
  }
}
