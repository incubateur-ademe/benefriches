import { createRouter, defineRoute, param } from "type-route";

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  onboarding: defineRoute("/premiers-pas"),
  login: defineRoute("/se-connecter"),
  createUser: defineRoute("/creer-un-compte"),
  createSiteFoncierIntro: defineRoute("/creer-site-foncier/introduction"),
  createSiteFoncier: defineRoute("/creer-site-foncier"),
  createProjectIntro: defineRoute(
    { siteId: param.query.string },
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
    (params) => `/mes-projets/${params.projectId}/impacts`,
  ),
  myProjects: defineRoute("/mes-projets"),
  selectProjectToCompare: defineRoute(
    { baseProjectId: param.path.string },
    (params) => `/mes-projets/${params.baseProjectId}/comparaison`,
  ),
  compareProjects: defineRoute(
    { baseProjectId: param.path.string, avecProjet: param.query.string },
    (params) => `/mes-projets/${params.baseProjectId}/comparaison`,
  ),
  siteFeatures: defineRoute(
    {
      siteId: param.path.string,
    },
    (params) => `/sites/${params.siteId}/caracteristiques`,
  ),
  budget: defineRoute("/budget"),
  stats: defineRoute("/statistiques"),
  mentionsLegales: defineRoute("/mentions-legales"),
  accessibilite: defineRoute("/accessibilite"),
  politiqueConfidentialite: defineRoute("/politique-de-confidentialite"),
});

export { RouteProvider, useRoute, routes };
