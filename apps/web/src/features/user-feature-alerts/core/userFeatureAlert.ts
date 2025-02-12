export type UserFeatureAlert = {
  id: string;
  userId: string;
  email: string;
  feature:
    | {
        type: "export_impacts";
        options: ("pdf" | "excel" | "sharing_link")[];
      }
    | {
        type: "compare_impacts";
        options: (
          | "same_project_on_other_site"
          | "other_project_on_same_site"
          | "statu_quo_scenario"
        )[];
      }
    | { type: "duplicate_project" };
};
