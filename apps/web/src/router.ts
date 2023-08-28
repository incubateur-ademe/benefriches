import { createRouter, defineRoute, param } from "type-route";

export type QuestionType =
  | "construction"
  | "intro"
  | "type"
  | "adresse"
  | "espaces.types"
  | "espaces.surfaces"
  | "confirmation";

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  login: defineRoute("/se-connecter"),
  createUser: defineRoute("/creer-un-compte"),
  mesSitesFonciers: defineRoute("/mes-sites-fonciers"),
  siteFoncierDetails: defineRoute(
    { siteFoncierName: param.path.string },
    (params) => `/mes-sites-fonciers/${params.siteFoncierName}`,
  ),
  siteFoncierForm: defineRoute(
    {
      question: param.query.optional.ofType<QuestionType>().default("intro"),
    },
    () => "/site-foncier/form",
  ),
});

export { RouteProvider, useRoute, routes };
