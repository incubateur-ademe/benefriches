import { createRouter, defineRoute, param } from "type-route";

import { BENEFRICHES_ENV } from "./envVars";

const onBoarding = defineRoute("/premiers-pas");

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  landingBenefriches: defineRoute("/commencer-avec-benefriches"),
  landingMutabilite: defineRoute("/commencer-avec-mutabilite"),
  // ONBOARDING GLOBAL
  onBoardingIdentity: onBoarding.extend(
    {
      hintEmail: param.query.optional.string,
      hintFirstName: param.query.optional.string,
      hintLastName: param.query.optional.string,
      redirectTo: param.query.optional.string,
    },
    () => "/identite",
  ),
  onBoardingIntroductionWhy: onBoarding.extend("/pourquoi-benefriches"),
  onBoardingIntroductionHow: onBoarding.extend("/comment-ca-marche"),
  accessBenefriches: defineRoute(
    { redirectTo: param.query.optional.string },
    () => "/acceder-a-benefriches",
  ),
  // AUTHENTIFICATION
  authWithToken: defineRoute(
    { token: param.query.string, redirectTo: param.query.optional.string },
    () => "/authentification/token",
  ),
  // FORMS
  createSiteFoncier: defineRoute(
    { etape: param.query.optional.string },
    () => "/creer-site-foncier",
  ),
  createProject: defineRoute(
    {
      etape: param.query.optional.string,
      siteId: param.query.string,
      beta: param.query.optional.boolean.default(
        BENEFRICHES_ENV.hasUrbanFormBetaFeature ? true : false,
      ),
    },
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
  // MUTABILITY
  fricheMutability: defineRoute("/evaluer-compatibilite-friche"),
  fricheMutabilityResults: defineRoute(
    { evaluationId: param.query.string },
    () => `/evaluer-compatibilite-friche/resultats`,
  ),
  // PAGES
  budget: defineRoute("/budget"),
  stats: defineRoute("/stats"),
  mentionsLegales: defineRoute("/mentions-legales"),
  accessibilite: defineRoute("/accessibilite"),
  politiqueConfidentialite: defineRoute("/politique-de-confidentialite"),
});

export { RouteProvider, useRoute, routes };
