import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";

export interface AdministratorRepository {
  // An array because users.email is not unique: several users can share an email
  // case-insensitively.
  getUsersByEmail(normalizedEmail: string): Promise<AdministratorCandidate[]>;
  getUserById(userId: string): Promise<AdministratorCandidate | undefined>;
  // Inserts the administrators row unless one exists for this user, so concurrent grants never
  // fail on the primary key. Reports whether a row was created and whether the grant's
  // administrator.granted event was already published (always false for a new row).
  grant(
    userId: string,
    grantedAt: Date,
  ): Promise<{ created: boolean; grantedEventPublished: boolean }>;
  // Records that the grant's administrator.granted event reached every subscriber. Keeps the
  // first date when the grant is already marked, so racing runs don't overwrite it.
  markGrantedEventPublished(userId: string, publishedAt: Date): Promise<void>;
}
