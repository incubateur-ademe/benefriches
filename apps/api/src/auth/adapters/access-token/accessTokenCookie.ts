import { parseCookie } from "cookie";
import type { Request } from "express";

export const ACCESS_TOKEN_COOKIE_KEY = "access_token";

// Nest's built-in cookie support (`@Cookies()`) only binds route handler parameters and leaves
// `req.cookies` empty, so a guard reads the `Cookie` header itself.
export function readAccessTokenCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  return parseCookie(cookieHeader)[ACCESS_TOKEN_COOKIE_KEY];
}
