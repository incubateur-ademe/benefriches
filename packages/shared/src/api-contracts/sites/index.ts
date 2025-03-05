import { createCustomSite } from "./createCustomSite";
import { createExpressSite } from "./createExpressSite";

export const sitesRoutes = {
  CREATE_CUSTOM_SITE: createCustomSite,
  CREATE_EXPRESS_SITE: createExpressSite,
} as const;
