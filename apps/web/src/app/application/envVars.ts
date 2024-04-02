type BenefrichesWindowEnv = Record<string, string | undefined>;

const windowEnv: BenefrichesWindowEnv | undefined = (
  window as Window & typeof globalThis & { _benefriches_env: BenefrichesWindowEnv | undefined }
)._benefriches_env;
if (!windowEnv)
  throw new Error(
    "window._benefriches_env is not defined, you need to generate env var js file first (see setup-env-vars in package.json)",
  );

export const BENEFRICHES_ENV = {
  matomoContainerUrl: windowEnv.WEBAPP_MATOMO_CONTAINER_URL ?? "",
  matomoTrackingEnabled: Boolean(windowEnv.WEBAPP_MATOMO_CONTAINER_URL),
};
