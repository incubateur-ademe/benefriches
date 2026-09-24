import { configDotenv } from "dotenv";
import knex, { type Knex } from "knex";
import path from "node:path";

import knexConfig from "../../sql-knex/knexConfig";

const dotEnvPath = path.resolve(process.cwd(), ".env");
configDotenv({ path: dotEnvPath });

// This script grants (or revokes with --revoke) administrator rights to the user with the given email.
// Usage: npx tsx set-user-as-admin.ts user@example.fr [--revoke]

async function setUserAsAdmin() {
  const [email, flag] = process.argv.slice(2);
  const revoke = flag === "--revoke";

  if (!email) {
    console.error("❌ Usage: set-user-as-admin.ts <email> [--revoke]");
    process.exit(1);
  }

  const sqlConnection: Knex = knex(knexConfig);

  try {
    const user = await sqlConnection("users").select("id").where("email", email).first();

    if (!user) {
      console.error(`❌ No user found with email ${email}`);
      process.exitCode = 1;
      return;
    }

    if (revoke) {
      const deleted = await sqlConnection("administrators").where("user_id", user.id).delete();
      console.log(
        deleted
          ? `✅ Revoked administrator rights for ${email} (${user.id})`
          : `ℹ️ ${email} (${user.id}) was not an administrator`,
      );
      return;
    }

    await sqlConnection("administrators")
      .insert({ user_id: user.id, created_at: new Date() })
      .onConflict("user_id")
      .ignore();
    console.log(`✅ ${email} (${user.id}) is now an administrator`);
  } catch (err: unknown) {
    console.error(`❌ Error: ${err as Error}`);
    process.exitCode = 1;
  } finally {
    await sqlConnection.destroy();
  }
}

void setUserAsAdmin();
