export type CompareImpactsFeatureAlert = {
  type: "compare_impacts";
  options: (
    | "same_project_on_agricultural_operation"
    | "same_project_on_prairie"
    | "statu_quo_scenario"
  )[];
};

export type ExportImpactsFeatureAlert = {
  type: "export_impacts";
  options: ("pdf" | "excel" | "sharing_link")[];
};

type DuplicateProjectFeatureAlert = { type: "duplicate_project" };

type MutafrichesAvailabilityAlert = {
  type: "mutafriches_availability";
};

export type UserFeatureAlert = {
  id: string;
  userId: string | undefined;
  email: string;
  feature:
    | ExportImpactsFeatureAlert
    | CompareImpactsFeatureAlert
    | DuplicateProjectFeatureAlert
    | MutafrichesAvailabilityAlert;
};
