import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";

export interface AdministratorRepository {
  // An array because users.email is not unique: several users can share an email
  // case-insensitively.
  getUsersByEmail(normalizedEmail: string): Promise<AdministratorCandidate[]>;
  getUserById(userId: string): Promise<AdministratorCandidate | undefined>;
  isAdministrator(userId: string): Promise<boolean>;
  grant(userId: string, grantedAt: Date): Promise<void>;
}
