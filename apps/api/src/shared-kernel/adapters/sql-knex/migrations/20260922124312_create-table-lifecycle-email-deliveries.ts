import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("lifecycle_email_deliveries", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    // Backed by the lifecycleEmailTypeSchema Zod enum in app code (src/notifications/core/models/lifecycleEmail.ts).
    table.string("email_type").notNullable();
    // Deliberately no related_entity_type column: email_type already determines whether
    // related_entity_id refers to a site or a reconversion project.
    table.uuid("related_entity_id");
    // "pending" | "sent" | "failed" — backed by lifecycleEmailDeliveryStatusSchema.
    table.string("status").notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("sent_at");
    table.text("error_message");

    table.index("user_id");
  });

  // Two PARTIAL unique indexes, not one. Postgres treats NULLs as distinct in a unique
  // index, so a single index over (user_id, email_type, related_entity_id) would never
  // deduplicate account-scoped emails, where related_entity_id IS NULL.
  await knex.raw(`
    CREATE UNIQUE INDEX lifecycle_email_deliveries_user_type_entity_unique
      ON lifecycle_email_deliveries (user_id, email_type, related_entity_id)
      WHERE related_entity_id IS NOT NULL
  `);
  await knex.raw(`
    CREATE UNIQUE INDEX lifecycle_email_deliveries_user_type_unique
      ON lifecycle_email_deliveries (user_id, email_type)
      WHERE related_entity_id IS NULL
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF EXISTS lifecycle_email_deliveries_user_type_unique`);
  await knex.raw(`DROP INDEX IF EXISTS lifecycle_email_deliveries_user_type_entity_unique`);
  await knex.schema.dropTableIfExists("lifecycle_email_deliveries");
}
