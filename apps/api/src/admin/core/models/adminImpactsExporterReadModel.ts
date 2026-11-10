export type AdminImpactsExporterListItem = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  structureName: string | null;
  impactsExportsCount: number;
  exportedProjectsCount: number;
  lastImpactsExportedAt: Date;
};
