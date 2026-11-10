import type { AdminImpactsExporterListItem } from "../models/adminImpactsExporterReadModel";

export interface AdminImpactsExportersQuery {
  list(props: { search?: string; page: number; pageSize: number }): Promise<{
    users: AdminImpactsExporterListItem[];
    total: number;
  }>;
}
