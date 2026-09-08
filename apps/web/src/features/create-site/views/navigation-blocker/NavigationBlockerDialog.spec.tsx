import { act, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider, routes } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import NavigationBlockerDialog from "./NavigationBlockerDialog";

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe("Site creation NavigationBlockerDialog", () => {
  it("asks for confirmation before leaving the wizard while the site is not saved yet", async () => {
    routes.createSite({ creationMode: "custom" }).push();
    renderWithProviders(<NavigationBlockerDialog saveState="idle" />);

    act(() => {
      routes.myEvaluations().push();
    });
    await flush();

    expect(
      screen.getByRole("heading", { name: /Êtes-vous sûr·e de vouloir quitter le formulaire/ }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/creer-site-foncier/custom");
  });

  it("lets the user move between wizard steps without confirming", async () => {
    routes.createSite({ creationMode: "custom" }).push();
    renderWithProviders(<NavigationBlockerDialog saveState="idle" />);

    act(() => {
      routes.createSite({ creationMode: "custom", etape: "adresse" }).push();
    });
    await flush();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.search).toBe("?etape=adresse");
  });

  it("keeps guarding the form after a step change", async () => {
    routes.createSite({ creationMode: "custom" }).push();
    renderWithProviders(<NavigationBlockerDialog saveState="idle" />);

    // Moving between steps is allowed and lets the blocker go, so it has to re-arm itself:
    // the form is still unsaved once the step change is through.
    act(() => {
      routes.createSite({ creationMode: "custom", etape: "adresse" }).push();
    });
    await flush();

    act(() => {
      routes.myEvaluations().push();
    });
    await flush();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/creer-site-foncier/custom");
  });

  it("lets the user leave for project creation once the site is saved, even when the save lands right after a step change", async () => {
    routes.createSite({ creationMode: "custom" }).push();
    const { rerender } = renderWithProviders(<NavigationBlockerDialog saveState="loading" />);

    // Submitting the last step moves the wizard to its result step, which syncs the URL: an
    // allowed navigation, after which the blocker re-arms.
    act(() => {
      routes.createSite({ creationMode: "custom", etape: "resultat" }).push();
    });
    await flush();

    // The save then succeeds, which must tear that blocker back down — a leftover one would
    // swallow the "Évaluer un projet" link click below with no dialog and no navigation.
    rerender(<NavigationBlockerDialog saveState="success" />);
    await flush();

    act(() => {
      routes.createProject({ siteId: "site-1" }).push();
    });
    await flush();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/creer-projet");
  });
});
