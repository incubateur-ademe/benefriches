import { useCallback } from "react";
import type { Route } from "type-route";

import { routes, useRoute } from "@/app/router";

const DETAILS_CODES_BY_SECTION = {
  global: "score",

  fullTimeJobsScore: "score.emplois",

  localPeopleQualityOfLifeScore: "score.qualite-de-vie",
  "localPeopleQualityOfLifeScore.livingEnvironment": "score.qualite-de-vie.cadre",
  "localPeopleQualityOfLifeScore.localHealthiness": "score.qualite-de-vie.sante",
  "localPeopleQualityOfLifeScore.accessToLocalServices": "score.qualite-de-vie.acces-services",
  "localPeopleQualityOfLifeScore.accessToHealthCare": "score.qualite-de-vie.acces-soins",
  "localPeopleQualityOfLifeScore.frichesAccidents": "score.qualite-de-vie.securite-friche",
  "localPeopleQualityOfLifeScore.trafficSecurity": "score.qualite-de-vie.securite-trafic",

  localAuthorityEconomicScore: "score.finances-collectivite",

  environmentScore: "score.environnement",
  "environmentScore.co2eqEmissionsVariation": "score.environnement.co2eq",
  "environmentScore.zanCompliance": "score.environnement.zan",
  "environmentScore.soilsQuality": "score.environnement.sols",
  "environmentScore.waterQuality": "score.environnement.eau",
  "environmentScore.ecosystemServices": "score.environnement.services-ecosystemiques",
} as const;

export type DetailsName = keyof typeof DETAILS_CODES_BY_SECTION;

export function serializeDetails(detailsName: DetailsName): string {
  return DETAILS_CODES_BY_SECTION[detailsName];
}

function invert<T extends Record<string, string>>(map: T): Record<string, keyof T | undefined> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
}

export const DETAILS_CODES_REVERSE = invert(DETAILS_CODES_BY_SECTION);

export function parseContentState(contenu: string | undefined): DetailsName | undefined {
  if (!contenu) return undefined;

  return DETAILS_CODES_REVERSE[contenu];
}

export const closeModalLink = () => {};

export default () => {
  const route = useRoute() as Route<typeof routes.projectImpactsDevelopmentScore>;
  return useCallback(
    (detailsName?: DetailsName) => {
      return routes[route.name]({
        ...route.params,
        details: detailsName ? serializeDetails(detailsName) : detailsName,
      }).link;
    },
    [route],
  );
};
