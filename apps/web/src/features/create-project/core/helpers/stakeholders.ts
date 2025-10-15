import { ProjectStakeholder } from "../project.types";

const DEFAULT_FUTURE_SITE_OWNER = {
  name: "Futur propriétaire inconnu",
  structureType: "unknown",
} as const satisfies ProjectStakeholder;

export const getFutureSiteOwner = (
  siteResalePlannedAfterDevelopment: boolean,
  currentSiteOwner: ProjectStakeholder | undefined,
): ProjectStakeholder => {
  if (siteResalePlannedAfterDevelopment || !currentSiteOwner) return DEFAULT_FUTURE_SITE_OWNER;

  return currentSiteOwner;
};

const DEFAULT_FUTURE_OPERATOR = {
  name: "Futur exploitant inconnu",
  structureType: "unknown",
} as const satisfies ProjectStakeholder;

export const getFutureOperator = (
  buildingsResalePlannedAfterDevelopment: boolean,
  projectDeveloper: ProjectStakeholder | undefined,
): ProjectStakeholder => {
  if (buildingsResalePlannedAfterDevelopment || !projectDeveloper) return DEFAULT_FUTURE_OPERATOR;

  return projectDeveloper;
};
