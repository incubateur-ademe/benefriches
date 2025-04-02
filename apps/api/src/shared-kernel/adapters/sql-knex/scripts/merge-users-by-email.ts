import { configDotenv } from "dotenv";
import knex, { Knex } from "knex";
import path from "node:path";

import knexConfig from "../../sql-knex/knexConfig";

const dotEnvPath = path.resolve(process.cwd(), ".env");
configDotenv({ path: dotEnvPath });

// This script merges users with the same email address into one user.
// It will keep the latest user, set user id as created_by for sites and reconversion_projects and delete the others.

async function mergeUsersByEmail() {
  const sqlConnection: Knex = knex(knexConfig);

  try {
    // Find all duplicate emails
    const duplicateEmails = await sqlConnection("users")
      .select("email")
      .groupBy("email")
      .havingRaw("COUNT(*) > 1");

    console.log(`🔎 Found ${duplicateEmails.length} duplicate emails`);

    // 2. For every duplicate email, keep the latest user
    for (const { email } of duplicateEmails) {
      const usersWithDuplicateEmail = await sqlConnection("users")
        .select("id")
        .where("email", email)
        .orderBy("created_at", "desc");

      const [latestUser, ...otherUsers] = usersWithDuplicateEmail;

      if (!latestUser) continue;

      const otherUsersIds = otherUsers.map((user) => user.id);

      const trx = await sqlConnection.transaction();

      try {
        const updatedSites = await trx("sites").whereIn("created_by", otherUsersIds).update({
          created_by: latestUser.id,
        });
        const updatedProjects = await trx("reconversion_projects")
          .whereIn("created_by", otherUsersIds)
          .update({
            created_by: latestUser.id,
          });
        await trx("users").whereIn("id", otherUsersIds).delete();

        await trx.commit();

        console.log(`✅ Email: ${email}`);
        console.log(`👉 Kept user: ${latestUser.id}`);
        console.log(`👉 Deleted user IDs: [${otherUsersIds.join(", ")}]`);
        console.log(`👉 Updated ${updatedSites} site(s) and ${updatedProjects} project(s)\n`);
      } catch (transactionError) {
        await trx.rollback();
        console.error(
          `❌ Transaction failed for email: ${email}. Error: ${transactionError as Error}`,
        );
      }
    }
  } catch (err: unknown) {
    console.error(`❌ Error: ${err as Error}`);
  } finally {
    await sqlConnection.destroy();
    console.log("Database connection closed.");
    console.log("Script finished.");
  }
}

void mergeUsersByEmail();
