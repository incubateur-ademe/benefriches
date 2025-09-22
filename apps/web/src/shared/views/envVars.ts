type BenefrichesWindowEnv = Record<string, string | undefined>;

const windowEnv: BenefrichesWindowEnv | undefined = (
  window as Window & typeof globalThis & { _benefriches_env: BenefrichesWindowEnv | undefined }
)._benefriches_env;
if (!windowEnv)
  throw new Error(
    "window._benefriches_env is not defined, you need to generate env var js file first (see setup-env-vars in package.json)",
  );

export const BENEFRICHES_ENV = {
  matomoTrackingEnabled: Boolean(windowEnv.WEBAPP_MATOMO_SITE_ID),
  matomoSiteId: windowEnv.WEBAPP_MATOMO_SITE_ID ?? "",
  matomoUrl: windowEnv.WEBAPP_MATOMO_URL ?? "",
  allowedDevelopmentPlanCategories:
    windowEnv.WEBAPP_ALLOWED_DEVELOPMENT_PLAN_CATEGORIES?.split(",") ?? [],
  authEnabled: windowEnv.WEBAPP_AUTH_ENABLED === "true",
  hasUrbanFormBetaFeature: windowEnv.WEBAPP_HAS_URBAN_FORM_BETA_FEATURE === "YES",
  mutafrichesUrl: windowEnv.WEBAPP_MUTAFRICHES_FRAME_SRC ?? "",
  mutafrichesIntegrator: windowEnv.WEBAPP_MUTAFRICHES_INTEGRATOR ?? "",
};
