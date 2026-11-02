import { afterEach, describe, expect, it, vi } from "vitest";

// The router reads the browser location when it is created, so each test sets the URL
// first and then loads a fresh copy of the module.
const loadRouterAt = async (url: string) => {
  window.history.replaceState(null, "", url);
  vi.resetModules();
  return await import("./router");
};

const currentUrl = () => `${window.location.pathname}${window.location.search}`;

describe("project features route", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("links to the correctly spelled project features URL", async () => {
    const { routes } = await loadRouterAt("/");

    expect(routes.projectFeatures({ projectId: "project-123" }).href).toEqual(
      "/mes-projets/project-123/caracteristiques",
    );
  });

  it("opens the project features page at the correctly spelled URL", async () => {
    const { session } = await loadRouterAt("/mes-projets/project-123/caracteristiques");

    const route = session.getInitialRoute();

    expect({ name: route.name, params: route.params, url: currentUrl() }).toEqual({
      name: "projectFeatures",
      params: { projectId: "project-123" },
      url: "/mes-projets/project-123/caracteristiques",
    });
  });

  it("redirects the former misspelled URL to the project features page of the same project", async () => {
    const { session } = await loadRouterAt("/mes-projets/project-123/caracterisques");

    const route = session.getInitialRoute();

    expect({ name: route.name, params: route.params, url: currentUrl() }).toEqual({
      name: "projectFeatures",
      params: { projectId: "project-123" },
      url: "/mes-projets/project-123/caracteristiques",
    });
  });

  it("keeps the query string when redirecting the former misspelled URL", async () => {
    const { session } = await loadRouterAt(
      "/mes-projets/project-123/caracterisques?details=environnement.sols&utm_source=email",
    );

    const route = session.getInitialRoute();

    expect({ name: route.name, params: route.params, url: currentUrl() }).toEqual({
      name: "projectFeatures",
      params: { projectId: "project-123", details: "environnement.sols" },
      url: "/mes-projets/project-123/caracteristiques?details=environnement.sols&utm_source=email",
    });
  });
});
