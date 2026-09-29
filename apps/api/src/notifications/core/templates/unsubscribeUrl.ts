// Public web-app page that posts the token to the API: never a mutating GET on the API
// itself, which mail link scanners would trigger on delivery.
const UNSUBSCRIBE_PATH = "/emails/desinscription";

export function buildUnsubscribeUrl(webappUrl: string, token: string): string {
  const url = new URL(UNSUBSCRIBE_PATH, webappUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
