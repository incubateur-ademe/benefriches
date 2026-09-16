/**
 * What the user actually asked for when they signed up, as recorded by the
 * `user.account-created` domain event.
 *
 * This is the only trustworthy source for `subscribedToNewsletter` when repairing
 * CRM data: the `users.subscribed_to_newsletter` column may since have been
 * overwritten by the newsletter sync job (see BackfillCrmContactsUseCase).
 */
export type UserSignupIntent = {
  firstName: string;
  lastName: string;
  subscribedToNewsletter: boolean;
};

export interface UserSignupIntentQuery {
  /**
   * Looked up by user id rather than email: emails can be reused across accounts, so an
   * email match could return the signup intent of a different, earlier account.
   *
   * Returns `null` when no signup event exists for this user, or when the recorded payload
   * does not match the expected shape — the caller must never guess missing values.
   */
  findByUserId(userId: string): Promise<UserSignupIntent | null>;
}
