import type { AdministratorQuery } from "src/admin/core/gateways/AdministratorQuery";

export class InMemoryAdministratorQuery implements AdministratorQuery {
  private administratorIds = new Set<string>();

  _setAdministrators(userIds: string[]): void {
    this.administratorIds = new Set(userIds);
  }

  isAdministrator(userId: string): Promise<boolean> {
    return Promise.resolve(this.administratorIds.has(userId));
  }
}
