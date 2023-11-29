import { createRouter, defineRoute, param } from "type-route";

const { RouteProvider, useRoute, routes } = createRouter({
  login: defineRoute("/se-connecter"),
  createUser: defineRoute("/creer-un-compte"),
  onboarding: defineRoute("/premiers-pas"),
  createSiteFoncierDocuments: defineRoute("/creer-site-foncier/documents"),
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
  myProjects: defineRoute(["/mes-projets", "/"]),
  selectProjectToCompare: defineRoute(
    { baseProjectId: param.path.string },
    (params) => `/mes-projets/${params.baseProjectId}/comparaison`,
  ),
  compareProjects: defineRoute(
    { baseProjectId: param.path.string, avecProjet: param.query.string },
    (params) => `/mes-projets/${params.baseProjectId}/comparaison`,
  ),
});

export { RouteProvider, useRoute, routes };
