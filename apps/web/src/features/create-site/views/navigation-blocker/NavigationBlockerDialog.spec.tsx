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

// The wizard's deferred resubscribe (see useNavigationBlocker) fires 100ms after an allowed
// navigation; wait past it.
const waitForDeferredResubscribe = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
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

  it("lets the user leave for project creation once the site is saved, even when the save lands right after a step change", async () => {
    routes.createSite({ creationMode: "custom" }).push();
    const { rerender } = renderWithProviders(<NavigationBlockerDialog saveState="loading" />);

    // Submitting the last step moves the wizard to its result step, which syncs the URL: an
    // allowed navigation that schedules a deferred resubscribe of the blocker.
    act(() => {
      routes.createSite({ creationMode: "custom", etape: "resultat" }).push();
    });
    await flush();

    // The save then succeeds before that deferred resubscribe fires.
    rerender(<NavigationBlockerDialog saveState="success" />);
    await waitForDeferredResubscribe();

    act(() => {
      routes.createProject({ siteId: "site-1" }).push();
    });
    await flush();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/creer-projet");
  });
});
