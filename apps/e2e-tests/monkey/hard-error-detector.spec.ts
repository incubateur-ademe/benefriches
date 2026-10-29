import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyConsoleMessage,
  classifyResponse,
  computeFingerprint,
  findBrokenText,
  inspectPageText,
  normalizeRoute,
} from "./hard-error-detector";

const ORIGIN = "https://staging.example.org";
const PAGE_URL = `${ORIGIN}/mes-evaluations`;
const SITE_ID = "ef93e226-c757-41e2-9607-c53747998347";

function response(method: string, path: string, status: number, pageUrl = PAGE_URL) {
  return classifyResponse({
    method,
    url: `${ORIGIN}${path}`,
    status,
    pageUrl,
    targetOrigin: ORIGIN,
  });
}

describe("classifyResponse", () => {
  it("reports a 5xx of the target origin as a server error", () => {
    assert.deepStrictEqual(response("POST", "/api/sites/create-express?x=1", 500), {
      type: "server-error",
      message: "500 POST /api/sites/create-express",
    });
  });

  it("reports an unexpected 4xx as a client error", () => {
    assert.deepStrictEqual(response("POST", "/api/sites/create-custom", 400), {
      type: "client-error",
      message: "400 POST /api/sites/create-custom",
    });
  });

  it("ignores responses of other origins", () => {
    const candidate = classifyResponse({
      method: "GET",
      url: "https://data.geopf.fr/geocodage/search",
      status: 503,
      pageUrl: PAGE_URL,
      targetOrigin: ORIGIN,
    });

    assert.equal(candidate, null);
  });

  it("ignores successful responses and redirects", () => {
    assert.equal(response("GET", "/api/site-evaluations", 200), null);
    assert.equal(response("GET", "/", 302), null);
  });

  it("ignores the rate limit", () => {
    assert.equal(response("POST", "/api/sites/create-express", 429), null);
  });

  it("ignores a 404 on a resource named by the page URL", () => {
    const pageUrl = `${ORIGIN}/mes-sites/${SITE_ID}/caracteristiques`;

    assert.equal(response("GET", `/api/sites/${SITE_ID}/features`, 404, pageUrl), null);
  });

  it("reports a 404 on a resource the page URL doesn't name", () => {
    assert.equal(response("GET", `/api/sites/${SITE_ID}/features`, 404)?.type, "client-error");
  });

  it("reports an admin API response as an admin access", () => {
    assert.deepStrictEqual(response("GET", "/api/admin/users", 200), {
      type: "admin-access",
      message: "Admin API response: 200 GET /api/admin/users",
    });
  });

  it("ignores the admin API refusing a regular user", () => {
    assert.equal(response("GET", "/api/admin/stats", 403), null);
    assert.equal(response("GET", "/api/admin/stats", 401), null);
  });
});

describe("classifyConsoleMessage", () => {
  it("reports a console error", () => {
    assert.deepStrictEqual(classifyConsoleMessage("error", "Something broke"), {
      type: "console-error",
      message: "Something broke",
    });
  });

  it("ignores other console levels", () => {
    assert.equal(classifyConsoleMessage("warning", "Careful"), null);
  });

  it("ignores failed requests, classified as responses or blocked on purpose", () => {
    const failedLoad =
      "Failed to load resource: the server responded with a status of 500 (Internal Server Error)";

    assert.equal(classifyConsoleMessage("error", failedLoad), null);
    assert.equal(
      classifyConsoleMessage("error", "GET https://x.org net::ERR_BLOCKED_BY_CLIENT"),
      null,
    );
  });
});

describe("findBrokenText", () => {
  it("finds NaN with its context", () => {
    assert.deepStrictEqual(findBrokenText("Superficie totale\nNaN m²"), {
      type: "broken-text",
      message: '"NaN" shown on the page: …Superficie totale NaN m²…',
    });
  });

  it("finds undefined", () => {
    assert.equal(findBrokenText("Commune : undefined")?.type, "broken-text");
  });

  it("ignores the words inside other words", () => {
    assert.equal(findBrokenText("NaNa, undefinedness, Nancy"), null);
  });
});

describe("inspectPageText", () => {
  it("finds nothing on a regular page", () => {
    assert.deepStrictEqual(inspectPageText(PAGE_URL, "Mes évaluations"), []);
  });

  it("reports a page without text as blank", () => {
    assert.deepStrictEqual(inspectPageText(PAGE_URL, " \n "), [
      { type: "blank-page", message: "Blank page: no text on the page" },
    ]);
  });

  it("reports an admin page shown to a regular user", () => {
    assert.deepStrictEqual(inspectPageText(`${ORIGIN}/admin/utilisateurs`, "Utilisateurs"), [
      { type: "admin-access", message: "Admin page shown to a regular user" },
    ]);
  });

  it("ignores an admin page that denies access", () => {
    const text = "Accès réservé aux administrateurs\nVous n'avez pas les droits nécessaires";

    assert.deepStrictEqual(inspectPageText(`${ORIGIN}/admin`, text), []);
  });

  it("doesn't take a page whose path starts with admin for an admin page", () => {
    assert.deepStrictEqual(inspectPageText(`${ORIGIN}/administration-locale`, "Texte"), []);
  });
});

describe("fingerprint", () => {
  it("is the same for the same error on the same page with other ids", () => {
    const otherId = "20cf6138-1064-497f-ae13-b893294b2ff0";
    const first = computeFingerprint(
      "server-error",
      `500 GET /api/sites/${SITE_ID}`,
      normalizeRoute(`${ORIGIN}/mes-sites/${SITE_ID}`),
    );
    const second = computeFingerprint(
      "server-error",
      `500 GET /api/sites/${otherId}`,
      normalizeRoute(`${ORIGIN}/mes-sites/${otherId}`),
    );

    assert.equal(first, second);
  });

  it("differs between two pages", () => {
    const message = "TypeError: x is undefined";

    assert.notEqual(
      computeFingerprint("js-exception", message, "/mes-evaluations"),
      computeFingerprint("js-exception", message, "/creer-site-foncier/custom?etape=adresse"),
    );
  });

  it("keeps the wizard step in the route", () => {
    assert.equal(
      normalizeRoute(`${ORIGIN}/creer-site-foncier/custom?etape=adresse`),
      "/creer-site-foncier/custom?etape=adresse",
    );
  });
});
