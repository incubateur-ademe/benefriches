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
  createSiteFoncierDocuments: defineRoute("/creer-site-foncier/documents"),
  createSiteFoncier: defineRoute("/creer-site-foncier"),
  createProjectIntro: defineRoute(
    {
      siteId: param.query.string,
    },
    () => "/creer-projet/introduction",
  ),
  createProject: defineRoute(
    {
      siteId: param.query.string,
    },
    () => "/creer-projet",
  ),
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/projets/${params.projectId}/impacts`,
  ),
  projectsList: defineRoute("/mes-projets"),
});

export { RouteProvider, useRoute, routes };
