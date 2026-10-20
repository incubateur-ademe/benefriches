import type { AdministratorRepository } from "src/admin/core/gateways/AdministratorRepository";
import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";

type AdministratorRow = { userId: string; grantedAt: Date };

export class InMemoryAdministratorRepository implements AdministratorRepository {
  private users: AdministratorCandidate[] = [];
  private administrators: AdministratorRow[] = [];

  _setUsers(users: AdministratorCandidate[]): void {
    this.users = users;
  }

  _setAdministrators(administrators: AdministratorRow[]): void {
    this.administrators = administrators;
  }

  _getAdministrators(): AdministratorRow[] {
    return this.administrators;
  }

  getUsersByEmail(normalizedEmail: string): Promise<AdministratorCandidate[]> {
    return Promise.resolve(
      this.users.filter(({ email }) => email.toLowerCase() === normalizedEmail),
    );
  }

  getUserById(userId: string): Promise<AdministratorCandidate | undefined> {
    return Promise.resolve(this.users.find(({ id }) => id === userId));
  }

  isAdministrator(userId: string): Promise<boolean> {
    return Promise.resolve(this.administrators.some((row) => row.userId === userId));
  }

  grant(userId: string, grantedAt: Date): Promise<void> {
    this.administrators = [...this.administrators, { userId, grantedAt }];
    return Promise.resolve();
  }
}
