import { createRouter, defineRoute, param } from "type-route";

import { ProjectSuggestion } from "@/features/create-project/core/project.types";
import { OnboardingVariant } from "@/features/onboarding/views/pages/when-to-use/OnboardingWhenToUsePage";

const onBoarding = defineRoute("/premiers-pas");

const { RouteProvider, useRoute, routes, session } = createRouter({
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
  onBoardingWhenToUse: onBoarding.extend(
    { fonctionnalite: param.query.ofType<OnboardingVariant>() },
    () => "/quand-utiliser-benefriches",
  ),
  onBoardingWhenNotToUse: onBoarding.extend(
    { fonctionnalite: param.query.ofType<OnboardingVariant>() },
    () => "/quand-ne-pas-utiliser-benefriches",
  ),
  onBoardingIntroductionHow: onBoarding.extend(
    { fonctionnalite: param.query.ofType<OnboardingVariant>() },
    () => "/comment-ca-marche",
  ),
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
  createSite: defineRoute({ etape: param.query.optional.string }, () => "/creer-site-foncier"),
  createProject: defineRoute(
    {
      siteId: param.query.string,
      etape: param.query.optional.string,
      projectSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    () => "/creer-projet",
  ),
  projectCreationOnboarding: defineRoute(
    {
      siteId: param.query.string,
      siteName: param.query.string,
      projectSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    () => "/creer-projet/introduction",
  ),
  updateProject: defineRoute(
    {
      etape: param.query.optional.string,
      projectId: param.path.string,
    },
    (params) => `/mes-projets/${params.projectId}/modifier`,
  ),
  // PROJECT IMPACTS
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/mes-projets/${params.projectId}/impacts`,
  ),
  projectImpactsOnboarding: defineRoute(
    {
      projectId: param.path.string,
      etape: param.query.optional.string,
      canSkipIntroduction: param.query.optional.boolean,
    },
    (params) => `/mes-projets/${params.projectId}/onboarding-impacts`,
  ),
  projectFeatures: defineRoute(
    { projectId: param.path.string },
    (params) => `/mes-projets/${params.projectId}/caracterisques`,
  ),
  urbanSprawlImpactsComparison: defineRoute(
    {
      projectId: param.path.string,
      page: param.query.optional.string,
      etape: param.query.optional.string,
    },
    (params) => `/mes-projets/${params.projectId}/comparaison-extension-urbaine`,
  ),
  // MES EVALUATIONS
  myEvaluations: defineRoute("/mes-evaluations"),
  siteFeatures: defineRoute(
    {
      siteId: param.path.string,
      fromCompatibilityEvaluation: param.query.optional.boolean,
      projectEvaluationSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    (params) => `/sites/${params.siteId}/caracteristiques`,
  ),
  siteEvaluatedProjects: defineRoute(
    {
      siteId: param.path.string,
      fromCompatibilityEvaluation: param.query.optional.boolean,
      projectEvaluationSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    (params) => `/sites/${params.siteId}/projets-evalues`,
  ),
  siteActionsList: defineRoute(
    {
      siteId: param.path.string,
      fromCompatibilityEvaluation: param.query.optional.boolean,
      projectEvaluationSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    (params) => `/sites/${params.siteId}/suivi-du-site`,
  ),
  siteCompatibilityEvaluation: defineRoute(
    {
      siteId: param.path.string,
      fromCompatibilityEvaluation: param.query.optional.boolean,
      projectEvaluationSuggestions: param.query.optional.array.ofType<ProjectSuggestion>(),
    },
    (params) => `/sites/${params.siteId}/analyse-de-compatibilite`,
  ),
  // RECONVERSION COMPATIBILITY
  evaluateReconversionCompatibility: defineRoute("/evaluer-compatibilite-friche"),
  reconversionCompatibilityResults: defineRoute(
    { mutafrichesId: param.query.string },
    () => `/evaluer-compatibilite-friche/resultats`,
  ),
  // PAGES
  budget: defineRoute("/budget"),
  stats: defineRoute("/stats"),
  mentionsLegales: defineRoute("/mentions-legales"),
  accessibilite: defineRoute("/accessibilite"),
  politiqueConfidentialite: defineRoute("/politique-de-confidentialite"),
});

export { RouteProvider, useRoute, routes, session };
