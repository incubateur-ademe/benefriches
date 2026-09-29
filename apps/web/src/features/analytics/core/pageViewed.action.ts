import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

// Tokens in links (magic login link, non-expiring unsubscribe link) must never reach the
// third-party analytics logs.
const REDACTED_QUERY_PARAMS = ["token"];

// Only the path, query and hash of the parsed URL are kept, so any base parses a relative URL:
// no need to read `window` from core.
const PARSING_BASE_URL = "http://localhost";

const redactSensitiveQueryParams = (url: string): string => {
  const parsedUrl = new URL(url, PARSING_BASE_URL);
  const paramsToRedact = REDACTED_QUERY_PARAMS.filter((param) => parsedUrl.searchParams.has(param));
  if (paramsToRedact.length === 0) {
    return url;
  }
  paramsToRedact.forEach((param) => {
    parsedUrl.searchParams.set(param, "REDACTED");
  });
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
};

export const pageViewed = createAppAsyncThunk<void, { url: string }>(
  "analytics/pageViewed",
  ({ url }, { extra }) => {
    extra.analyticsService.trackPageView(redactSensitiveQueryParams(url));
  },
);
