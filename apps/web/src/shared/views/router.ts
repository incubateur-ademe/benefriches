import { createRouter, defineRoute, param } from "type-route";

const onBoarding = defineRoute("/premiers-pas");

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  // ONBOARDING GLOBAL
  onBoardingIdentity: onBoarding.extend("/identite"),
  onBoardingIntroductionWhy: onBoarding.extend("/pourquoi-benefriches"),
  onBoardingIntroductionHow: onBoarding.extend("/comment-ca-marche"),
  login: defineRoute("/se-connecter"),
  createUser: defineRoute("/creer-un-compte"),
  // FORMS
  createSiteFoncier: defineRoute(
    { etape: param.query.optional.string },
    () => "/creer-site-foncier",
  ),
  createProject: defineRoute(
    { etape: param.query.optional.string, siteId: param.query.string },
    () => "/creer-projet",
  ),
  // PROJECT IMPACTS
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/mes-projets/${params.projectId}/impacts`,
  ),
  projectImpactsOnboarding: defineRoute(
    { projectId: param.path.string, etape: param.query.optional.string },
    (params) => `/mes-projets/${params.projectId}/onboarding-impacts`,
  ),
  urbanSprawlImpactsComparison: defineRoute(
    {
      projectId: param.path.string,
      page: param.query.optional.string,
      etape: param.query.optional.string,
    },
    (params) => `/mes-projets/${params.projectId}/comparaison-extension-urbaine`,
  ),
  // MES PROJETS
  myProjects: defineRoute("/mes-projets"),
  siteFeatures: defineRoute(
    {
      siteId: param.path.string,
    },
    (params) => `/sites/${params.siteId}/caracteristiques`,
  ),
  // PAGES
  budget: defineRoute("/budget"),
  stats: defineRoute("/statistiques"),
  mentionsLegales: defineRoute("/mentions-legales"),
  accessibilite: defineRoute("/accessibilite"),
  politiqueConfidentialite: defineRoute("/politique-de-confidentialite"),
});

export { RouteProvider, useRoute, routes };
