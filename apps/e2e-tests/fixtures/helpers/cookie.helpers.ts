import type { Page } from "@playwright/test";

/**
 * Extracts cookies from a Playwright page context and formats them as an HTTP Cookie header.
 * Used for authenticating API requests with session cookies from browser context.
 */
export async function extractCookieHeader(page: Page): Promise<string> {
  const cookies = await page.context().cookies();
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

/**
 * Parses a Set-Cookie header string into a cookie object for Playwright.
 * Used to extract session cookies from API responses.
 */
export function parseCookieString(
  setCookieHeader: string,
  baseURL: string,
): { name: string; value: string; domain: string; path: string } | null {
  const parts = setCookieHeader.split(";").map((p) => p.trim());
  const [nameValue] = parts;
  if (!nameValue) return null;

  const [name, value] = nameValue.split("=");
  if (!name || !value) return null;

  const url = new URL(baseURL);
  const domain = url.hostname;

  return {
    name,
    value,
    domain,
    path: "/",
  };
}
