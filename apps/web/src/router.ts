import { createRouter, defineRoute, param } from "type-route";

export type QuestionType =
  | "construction"
  | "type"
  | "adresse"
  | "espaces.types"
  | "espaces.surfaces"
  | "confirmation";

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  login: defineRoute("/se-connecter"),
  createUser: defineRoute("/creer-un-compte"),
  onboarding: defineRoute("/premiers-pas"),
  mesSitesFonciers: defineRoute("/mes-sites-fonciers"),
  siteFoncierDetails: defineRoute(
    { siteFoncierName: param.path.string },
    (params) => `/mes-sites-fonciers/${params.siteFoncierName}`,
  ),
  createSiteFoncier: defineRoute(
    {
      question: param.query.optional.ofType<QuestionType>().default("type"),
    },
    () => "/creer-site-foncier",
  ),
});

export { RouteProvider, useRoute, routes };
