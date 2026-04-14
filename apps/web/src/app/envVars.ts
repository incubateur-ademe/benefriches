type BenefrichesWindowEnv = Record<string, string | undefined>;

const windowEnv: BenefrichesWindowEnv | undefined = (
  window as Window & typeof globalThis & { _benefriches_env: BenefrichesWindowEnv | undefined }
)._benefriches_env;
if (!windowEnv)
  throw new Error(
    "window._benefriches_env is not defined, you need to generate env var js file first (see setup-env-vars in package.json)",
  );

const parseBooleanFlag = (value: string | undefined): boolean => {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true";
};

export const BENEFRICHES_ENV = {
  matomoTrackingEnabled: Boolean(windowEnv.WEBAPP_MATOMO_SITE_ID),
  matomoSiteId: windowEnv.WEBAPP_MATOMO_SITE_ID ?? "",
  matomoUrl: windowEnv.WEBAPP_MATOMO_URL ?? "",
  mutafrichesUrl: windowEnv.WEBAPP_MUTAFRICHES_FRAME_SRC ?? "",
  mutafrichesIntegrator: windowEnv.WEBAPP_MUTAFRICHES_INTEGRATOR ?? "",
  crispEnabled: Boolean(windowEnv.WEBAPP_CRISP_WEBSITE_ID),
  crispWebsiteId: windowEnv.WEBAPP_CRISP_WEBSITE_ID ?? "",
  featureFlags: {
    allowedDevelopmentPlanCategories:
      windowEnv.WEBAPP_FF_ALLOWED_DEVELOPMENT_PLAN_CATEGORIES?.split(",") ?? [],
    urbanZoneEnabled: parseBooleanFlag(windowEnv.WEBAPP_FF_SITE_URBAN_ZONE_ENABLED),
    urbanProjectBuildingsReuseChapterEnabled: parseBooleanFlag(
      windowEnv.WEBAPP_FF_URBAN_PROJECT_BUILDINGS_REUSE_CHAPTER_ENABLED,
    ),
  },
};
