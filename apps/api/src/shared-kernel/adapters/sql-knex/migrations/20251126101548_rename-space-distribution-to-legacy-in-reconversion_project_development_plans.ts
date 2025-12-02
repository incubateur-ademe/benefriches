import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE reconversion_project_development_plans
    SET features = (features::jsonb - 'spacesDistribution' || jsonb_build_object('legacySpacesDistribution', features->'spacesDistribution'))::json
    WHERE features->>'spacesDistribution' IS NOT NULL and reconversion_project_development_plans.type = 'URBAN_PROJECT'
    
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE reconversion_project_development_plans
    SET features = (features::jsonb - 'legacySpacesDistribution' || jsonb_build_object('spacesDistribution', features->'legacySpacesDistribution'))::jsonb
    WHERE features->>'legacySpacesDistribution' IS NOT NULL and reconversion_project_development_plans.type = 'URBAN_PROJECT'
  `);
}
