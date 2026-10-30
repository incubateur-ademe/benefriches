import type { Commit } from "./commits.ts";
import { AREAS, type OtherChange, type ReleaseSummary } from "./llm.ts";

type CardInput = {
  version: string;
  date: Date;
  compareUrl: string;
  commits: Commit[];
};

type ReleaseCardInput = CardInput & {
  repository: string;
  summary: ReleaseSummary;
};

type CardElement = Record<string, unknown>;

const CONVENTIONAL_TYPE_REGEX = /^(\w+)(\([^)]*\))?!?:/;
const OTHER_TYPE = "other";

const getCommitType = (subject: string): string =>
  CONVENTIONAL_TYPE_REGEX.exec(subject)?.[1]?.toLowerCase() ?? OTHER_TYPE;

const groupByType = (commits: Commit[]): Map<string, Commit[]> => {
  const groups = new Map<string, Commit[]>();
  for (const commit of commits) {
    const type = getCommitType(commit.subject);
    groups.set(type, [...(groups.get(type) ?? []), commit]);
  }
  return groups;
};

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(date);

const renderCommit = (commit: Commit): CardElement[] => [
  { type: "TextBlock", text: `${commit.subject} (\`${commit.id.slice(0, 7)}\`)`, wrap: true },
  ...(commit.body === ""
    ? []
    : [{ type: "TextBlock", text: commit.body, wrap: true, isSubtle: true, spacing: "None" }]),
];

const renderGroup = ([type, commits]: [string, Commit[]]): CardElement[] => {
  const title: CardElement = {
    type: "TextBlock",
    text: `${type} (${commits.length})`,
    weight: "Bolder",
    spacing: "Medium",
  };
  return [title].concat(commits.flatMap(renderCommit));
};

const SHORT_ID_LENGTH = 7;

const wrapCard = (
  { version, date, compareUrl }: CardInput | ReleaseCardInput,
  content: CardElement[],
) => ({
  type: "message",
  attachments: [
    {
      contentType: "application/vnd.microsoft.card.adaptive",
      contentUrl: null,
      content: {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.4",
        msteams: { width: "Full" },
        body: [
          {
            type: "TextBlock",
            text: `Bénéfriches ${version} - ${formatDate(date)}`,
            weight: "Bolder",
            size: "Large",
            wrap: true,
          },
          { type: "TextBlock", text: `[Voir le diff sur GitHub](${compareUrl})`, wrap: true },
          ...content,
        ],
      },
    },
  ],
});

export const buildCard = (input: CardInput) =>
  wrapCard(input, [...groupByType(input.commits)].flatMap(renderGroup));

const sectionTitle = (text: string): CardElement => ({
  type: "TextBlock",
  text,
  weight: "Bolder",
  size: "Medium",
  spacing: "Large",
  separator: true,
});

const subTitle = (text: string): CardElement => ({
  type: "TextBlock",
  text,
  weight: "Bolder",
  spacing: "Medium",
});

const renderChange = (change: OtherChange, repository: string): CardElement => {
  const links = change.commitIds
    .map((id) => `[${id.slice(0, SHORT_ID_LENGTH)}](https://github.com/${repository}/commit/${id})`)
    .join(", ");
  return {
    type: "TextBlock",
    text: `- ${change.summary} (${links})`,
    wrap: true,
    spacing: "Small",
  };
};

const renderChangesByArea = (changes: OtherChange[], repository: string): CardElement[] =>
  AREAS.flatMap((area) => {
    const areaChanges = changes.filter((change) => change.area === area);
    return areaChanges.length === 0
      ? []
      : [subTitle(area)].concat(areaChanges.map((change) => renderChange(change, repository)));
  });

const renderChangeGroup = (title: string, changes: OtherChange[], repository: string) =>
  changes.length === 0
    ? []
    : [
        { ...subTitle(title), size: "Default", color: "Accent" },
        ...renderChangesByArea(changes, repository),
      ];

export const buildReleaseCard = (input: ReleaseCardInput) => {
  const { summary, repository, commits } = input;
  const unclassified = commits.filter((commit) =>
    summary.unclassifiedCommitIds.includes(commit.id),
  );
  const fixes = summary.otherChanges.filter((change) => change.userVisibleFix);
  const internal = summary.otherChanges.filter((change) => !change.userVisibleFix);

  const features: CardElement[] =
    summary.features.length === 0
      ? [
          {
            type: "TextBlock",
            text: "Aucune nouveauté dans cette version.",
            wrap: true,
            isSubtle: true,
          },
        ]
      : summary.features.flatMap((feature) => [
          subTitle(feature.title),
          { type: "TextBlock", text: feature.description, wrap: true, spacing: "None" },
        ]);

  return wrapCard(input, [
    sectionTitle("Nouveautés"),
    ...features,
    sectionTitle("Autres changements"),
    ...renderChangeGroup("Corrections visibles par les utilisateurs", fixes, repository),
    ...renderChangeGroup("Changements internes", internal, repository),
    ...(unclassified.length === 0
      ? []
      : [
          subTitle("Non classés"),
          ...unclassified.map((commit) =>
            renderChange(
              {
                area: "Infra",
                userVisibleFix: false,
                summary: commit.subject,
                commitIds: [commit.id],
              },
              repository,
            ),
          ),
        ]),
  ]);
};
