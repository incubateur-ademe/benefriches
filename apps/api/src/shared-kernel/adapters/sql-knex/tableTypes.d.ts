export type SqlUser = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  structure_name?: string;
  structure_type?: string;
  structure_activity?: string;
  created_at: Date;
  created_from: "features_app" | "demo_app";
  personal_data_storage_consented_at: Date;
  personal_data_analytics_use_consented_at?: Date;
  personal_data_communication_use_consented_at?: Date;
};

/*
  SITES TABLES
*/
type SqlSite = {
  id: string;
  name: string;
  created_by: string;
  creation_mode: string;
  description: string | null;
  surface_area: number;
  is_friche: boolean;
  owner_structure_type: string;
  owner_name: string | null;
  tenant_structure_type: string | null;
  tenant_name: string | null;
  // friche related
  friche_activity: string | null;
  friche_has_contaminated_soils: boolean | null;
  friche_contaminated_soil_surface_area: number | null;
  friche_accidents_minor_injuries: number | null;
  friche_accidents_severe_injuries: number | null;
  friche_accidents_deaths: number | null;
  // dates
  created_at: Date;
};

type SqlAddress = {
  id: string;
  ban_id: string;
  value: string;
  city: string;
  city_code: string;
  post_code: string;
  lat: number;
  long: number;
  street_name: string | null;
  street_number: string | null;
  site_id: string;
};

type SqlSiteSoilsDistribution = {
  id: string;
  soil_type: SoilType;
  surface_area: number;
  site_id: string;
};

type SqlSiteExpense = {
  id: string;
  site_id: string;
  purpose: string;
  bearer: string;
  purpose_category: string;
  amount: number;
};

type SqlSiteIncome = {
  id: string;
  site_id: string;
  source: string;
  amount: number;
};

/*
  RECONVERSION PROJECTS TABLES
*/
export type SqlReconversionProject = {
  id: string;
  created_by: string;
  creation_mode: string;
  name: string;
  description?: string;
  related_site_id: string;
  future_operator_name?: string;
  future_operator_structure_type?: string;
  future_site_owner_name?: string;
  future_site_owner_structure_type?: string;
  operations_first_year?: number;
  // reinstatement
  reinstatement_contract_owner_name?: string;
  reinstatement_contract_owner_structure_type?: string;
  reinstatement_schedule_start_date?: Date;
  reinstatement_schedule_end_date?: Date;
  // site purchase
  site_purchase_selling_price?: number;
  site_purchase_property_transfer_duties?: number;
  // site resale
  site_resale_expected_selling_price?: number;
  site_resale_expected_property_transfer_duties?: number;
  // project phase
  project_phase: string;
  // dates
  created_at: Date;
  friche_decontaminated_soil_surface_area?: number;
};

type SqlReconversionProjectSoilsDistribution = {
  id: string;
  soil_type: SoilType;
  surface_area: number;
  reconversion_project_id: string;
};

type SqlDevelopmentPlan = {
  id: string;
  type: string;
  developer_name: string;
  developer_structure_type: string;
  features: unknown;
  reconversion_project_id: string;
  schedule_start_date?: Date;
  schedule_end_date?: Date;
};

type SqlDevelopmentPlanCost = {
  id: string;
  purpose: string;
  amount: number;
  development_plan_id: string;
};

type SqlReconversionProjectExpense = {
  id: string;
  purpose: string;
  amount: number;
  reconversion_project_id: string;
};

type SqlRevenue = {
  id: string;
  source: string;
  amount: number;
  reconversion_project_id: string;
};

type SqlReinstatementCost = {
  id: string;
  purpose: string;
  amount: number;
  reconversion_project_id: string;
};

declare module "knex/types/tables" {
  interface Tables {
    // reconversion projects
    reconversion_projects: SqlReconversionProject;
    reconversion_project_soils_distributions: SqlReconversionProjectSoilsDistribution;
    reconversion_project_development_plans: SqlDevelopmentPlan;
    reconversion_project_yearly_expenses: SqlReconversionProjectExpense;
    reconversion_project_yearly_revenues: SqlRevenue;
    reconversion_project_reinstatement_costs: SqlReinstatementCost;
    reconversion_project_financial_assistance_revenues: SqlRevenue;

    // sites
    sites: SqlSite;
    addresses: SqlAddress;
    site_soils_distributions: SqlSiteSoilsDistribution;
    site_expenses: SqlSiteExpense;
    site_incomes: SqlSiteIncome;

    // users
    users: SqlUser;
  }
}
