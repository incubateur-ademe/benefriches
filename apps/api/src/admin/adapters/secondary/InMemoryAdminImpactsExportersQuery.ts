import type { AdminImpactsExportersQuery } from "src/admin/core/gateways/AdminImpactsExportersQuery";
import type { AdminImpactsExporterListItem } from "src/admin/core/models/adminImpactsExporterReadModel";

export class InMemoryAdminImpactsExportersQuery implements AdminImpactsExportersQuery {
  private exporters: AdminImpactsExporterListItem[] = [];

  _setExporters(exporters: AdminImpactsExporterListItem[]): void {
    this.exporters = exporters;
  }

  list({
    search,
    page,
    pageSize,
  }: {
    search?: string;
    page: number;
    pageSize: number;
  }): Promise<{ users: AdminImpactsExporterListItem[]; total: number }> {
    const normalizedSearch = search?.toLowerCase();
    const matching = this.exporters
      .filter((user) => {
        if (!normalizedSearch) return true;
        return [user.email, user.firstName, user.lastName, user.structureName].some((value) =>
          value?.toLowerCase().includes(normalizedSearch),
        );
      })
      .toSorted(
        (a, b) =>
          b.lastImpactsExportedAt.getTime() - a.lastImpactsExportedAt.getTime() ||
          b.id.localeCompare(a.id),
      );

    return Promise.resolve({
      users: matching.slice((page - 1) * pageSize, page * pageSize),
      total: matching.length,
    });
  }
}
