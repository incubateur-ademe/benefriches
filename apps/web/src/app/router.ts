import type { Route, ValueSerializer } from "type-route";
import { createGroup, createRouter, defineRoute, noMatch, param } from "type-route";

import type { ProjectSuggestion } from "@/features/create-project/core/project.types";
import { onboardingVariantSchema } from "@/features/onboarding/views/pages/step-shell/onboardingVariant";

import { routes as seoRoutesConfig } from "./seo.json";

const publicRoutes = [
  "home",
  "budget",
  "stats",
  "mentionsLegales",
  "accessibilite",
  "politiqueConfidentialite",
  "accessBenefriches",
  "authWithToken",
  "onBoardingIdentity",
  "lifecycleEmailsUnsubscribe",
] as const;

type PublicRouteName = (typeof publicRoutes)[number];

export const seoByRoute = seoRoutesConfig satisfies Record<
  PublicRouteName,
  {
    path: string;
    title: string;
    description?: string | null;
    indexable: boolean;
  }
>;

const onBoarding = defineRoute("/premiers-pas");
const projectImpacts = defineRoute(
  {
    projectId: param.path.string,
    details: param.query.optional.string,
  },
  (params) => `/mes-projets/${params.projectId}`,
);

const getEnumValueSerializer = <T extends string>(values: T[]): ValueSerializer<T> => ({
  parse(raw): T | typeof noMatch {
    if ((values as string[]).includes(raw)) {
      return raw as T;
    }
    return noMatch;
  },
  stringify(value) {
    return value;
  },
});

const onBoardingFeatureSerializer = getEnumValueSerializer([...onboardingVariantSchema.options]);

// The project features page used to live at the misspelled `/mes-projets/<id>/caracterisques`.
// Links to it may have been shared, so the old URL is rewritten to the new one, with its whole
// query string and hash, before the router reads the location. A type-route secondary path would
// keep only the query params the route declares.
const LEGACY_PROJECT_FEATURES_PATH = /^(\/mes-projets\/[^/]+)\/caracterisques\/?$/;

const redirectLegacyUrl = () => {
  const { pathname, search, hash } = window.location;
  const match = LEGACY_PROJECT_FEATURES_PATH.exec(pathname);
  if (!match) {
    return;
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${match[1]}/caracteristiques${search}${hash}`,
  );
};

redirectLegacyUrl();

const { RouteProvider, useRoute, routes, session } = createRouter(
  { scrollToTop: false },
  {
    home: defineRoute(seoByRoute.home.path),
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
    // ONBOARDING (OLD FLOW - used for evaluation-mutabilite entry point)
    onBoardingWhenToUse: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/quand-utiliser-benefriches",
    ),
    onBoardingWhenNotToUse: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/quand-ne-pas-utiliser-benefriches",
    ),
    onBoardingIntroductionHow: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/comment-ca-marche",
    ),
    // ONBOARDING STEPS
    onBoardingWelcome: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/bienvenue",
    ),
    onBoardingMethodology: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/methodologie",
    ),
    onBoardingTestimonials: onBoarding.extend(
      { fonctionnalite: param.query.optional.ofType(onBoardingFeatureSerializer) },
      () => "/temoignages",
    ),
    accessBenefriches: defineRoute(
      { redirectTo: param.query.optional.string },
      () => seoByRoute.accessBenefriches.path,
    ),
    // AUTHENTIFICATION
    authWithToken: defineRoute(
      { token: param.query.string, redirectTo: param.query.optional.string },
      () => seoByRoute.authWithToken.path,
    ),
    // FORMS
    createSite: defineRoute(
      {
        etape: param.query.optional.string,
        creationMode: param.path.trailing.optional.ofType(
          getEnumValueSerializer(["custom", "demo"] as const),
        ),
        evaluationMode: param.query.optional.ofType(getEnumValueSerializer(["impacts"] as const)),
      },
      (p) => `/creer-site-foncier/${p.creationMode}`,
    ),
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
        from: param.query.optional.ofType<"impacts" | "evaluations" | "site">(),
        projectId: param.path.string,
      },
      (params) => `/mes-projets/${params.projectId}/modifier`,
    ),
    updateSite: defineRoute(
      {
        etape: param.query.optional.string,
        from: param.query.optional.ofType<"evaluations" | "site">(),
        siteId: param.path.string,
      },
      (params) => `/sites/${params.siteId}/modifier`,
    ),
    // PROJECT IMPACTS
    projectImpactsSummary: projectImpacts.extend(`/apercu`),
    projectImpactsDevelopmentScore: projectImpacts.extend(`/score-impacts`),
    projectImpactsBreakEvenLevel: projectImpacts.extend(`/analyse-cout-benefice`),
    projectAvoidedCostsAnalysis: projectImpacts.extend(`/analyse-couts-evites`),
    projectImpactsOnboarding: projectImpacts.extend(
      {
        etape: param.query.optional.string,
      },
      () => `/onboarding-impacts`,
    ),
    projectFeatures: projectImpacts.extend(`/caracteristiques`),
    readImpactsDoc: defineRoute("/methodologie-calculs-impacts"),
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
    // ADMINISTRATION
    admin: defineRoute("/admin"),
    adminUsers: defineRoute(
      { search: param.query.optional.string, page: param.query.optional.number },
      () => "/admin/utilisateurs",
    ),
    adminUser: defineRoute(
      { userId: param.path.string },
      (params) => `/admin/utilisateurs/${params.userId}`,
    ),
    adminImpactsExporters: defineRoute(
      { search: param.query.optional.string, page: param.query.optional.number },
      () => "/admin/exports",
    ),
    // PAGES
    budget: defineRoute(seoByRoute.budget.path),
    stats: defineRoute(seoByRoute.stats.path),
    mentionsLegales: defineRoute(seoByRoute.mentionsLegales.path),
    accessibilite: defineRoute(seoByRoute.accessibilite.path),
    politiqueConfidentialite: defineRoute(seoByRoute.politiqueConfidentialite.path),
    // LIFECYCLE EMAILS
    // Token optional so a truncated link shows the unsubscribe error page, not the 404.
    lifecycleEmailsUnsubscribe: defineRoute(
      { token: param.query.optional.string },
      () => seoByRoute.lifecycleEmailsUnsubscribe.path,
    ),
  },
);

const routesGroups = {
  public: createGroup(publicRoutes.map((name) => routes[name])),
};

export type PublicRoute = Extract<Route<typeof routes>, { name: PublicRouteName | false }>;

export { RouteProvider, useRoute, routes, session, routesGroups };
