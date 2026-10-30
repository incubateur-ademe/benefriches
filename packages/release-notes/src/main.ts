import { buildCard, buildReleaseCard } from "./card.ts";
import { isKnownCommit, listNonMergeCommits } from "./commits.ts";
import { readGlossary, summariseCommits } from "./llm.ts";

const warn = (message: string) => process.stderr.write(`warning: ${message}\n`);

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === "") throw new Error(`Missing environment variable ${name}`);
  return value;
};

const main = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const runNumber = requireEnv("RUN_NUMBER");
  const currentCommit = requireEnv("CURRENT_COMMIT");
  const repository = requireEnv("GITHUB_REPOSITORY");
  const previousCommit = process.env["PREVIOUS_COMMIT"];

  if (previousCommit === undefined || previousCommit === "") {
    warn("no previous commit: nothing posted");
    return;
  }
  if (!isKnownCommit(previousCommit)) {
    warn(`previous commit ${previousCommit} is not in git history: nothing posted`);
    return;
  }

  const commits = listNonMergeCommits(previousCommit, currentCommit);
  if (commits.length === 0) {
    process.stderr.write("no commits in range: nothing posted\n");
    return;
  }

  const version = `v${runNumber}`;
  const date = new Date();
  const compareUrl = `https://github.com/${repository}/compare/${previousCommit}...${currentCommit}`;

  const card = await (async () => {
    try {
      const summary = await summariseCommits(
        commits,
        readGlossary(),
        requireEnv("ANTHROPIC_API_KEY"),
      );
      if (summary.unclassifiedCommitIds.length > 0) {
        warn(
          `${summary.unclassifiedCommitIds.length} commit(s) not covered by the model, listed as "Non classés"`,
        );
      }
      return buildReleaseCard({ version, date, compareUrl, repository, commits, summary });
    } catch (error: unknown) {
      warn(
        `LLM summary failed, posting the plain card: ${error instanceof Error ? error.message : String(error)}`,
      );
      return buildCard({ version, date, compareUrl, commits });
    }
  })();

  if (dryRun) {
    process.stdout.write(`${JSON.stringify(card, null, 2)}\n`);
    return;
  }

  const webhookUrl = requireEnv("TEAMS_RELEASES_WEBHOOK_URL");
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
    if (!response.ok) warn(`Teams webhook answered ${response.status}`);
  } catch (error: unknown) {
    warn(`could not post to Teams: ${error instanceof Error ? error.message : String(error)}`);
  }
};

main().catch((error: unknown) => {
  warn(error instanceof Error ? error.message : String(error));
});
