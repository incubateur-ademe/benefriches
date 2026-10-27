import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Product decision (BEN-70): existing urban projects lose their building operating balance in impacts.
  const urbanProjectIds = knex("reconversion_project_development_plans")
    .select("reconversion_project_id")
    .where("type", "URBAN_PROJECT");

  await knex("reconversion_project_yearly_expenses")
    .whereIn("reconversion_project_id", urbanProjectIds)
    .delete();
  await knex("reconversion_project_yearly_revenues")
    .whereIn("reconversion_project_id", urbanProjectIds)
    .delete();
}

export function down(): void {
  return; // Deleted data cannot be restored
}
