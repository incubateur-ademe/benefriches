import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";

export interface AdministratorRepository {
  // An array because users.email is not unique: several users can share an email
  // case-insensitively.
  getUsersByEmail(normalizedEmail: string): Promise<AdministratorCandidate[]>;
  getUserById(userId: string): Promise<AdministratorCandidate | undefined>;
  // Inserts the administrators row unless one exists for this user. Reports whether a row was
  // created, so concurrent grants never fail on the primary key.
  grant(userId: string, grantedAt: Date): Promise<{ created: boolean }>;
}
