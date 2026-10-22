import type { AdministratorRepository } from "src/admin/core/gateways/AdministratorRepository";
import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";

type AdministratorRow = { userId: string; grantedAt: Date; grantedEventPublishedAt: Date | null };

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

  // Mirrors the SQL primary key on user_id: an existing row is kept and nothing is inserted.
  grant(
    userId: string,
    grantedAt: Date,
  ): Promise<{ created: boolean; grantedEventPublished: boolean }> {
    const existing = this.administrators.find((row) => row.userId === userId);
    if (existing) {
      return Promise.resolve({
        created: false,
        grantedEventPublished: existing.grantedEventPublishedAt !== null,
      });
    }
    this.administrators = [
      ...this.administrators,
      { userId, grantedAt, grantedEventPublishedAt: null },
    ];
    return Promise.resolve({ created: true, grantedEventPublished: false });
  }

  // Mirrors the SQL update guarded by "granted_event_published_at is null".
  markGrantedEventPublished(userId: string, publishedAt: Date): Promise<void> {
    this.administrators = this.administrators.map((row) =>
      row.userId === userId && row.grantedEventPublishedAt === null
        ? { ...row, grantedEventPublishedAt: publishedAt }
        : row,
    );
    return Promise.resolve();
  }
}
