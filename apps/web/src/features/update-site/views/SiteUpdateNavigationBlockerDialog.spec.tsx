import { act, fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider, routes } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import SiteUpdateNavigationBlockerDialog from "./SiteUpdateNavigationBlockerDialog";

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

describe("SiteUpdateNavigationBlockerDialog", () => {
  it("does not open the dialog while there are no unsaved changes, and lets navigation complete", () => {
    routes.updateSite({ siteId: "site-1" }).push();
    renderWithProviders(<SiteUpdateNavigationBlockerDialog shouldBlock={false} />);

    act(() => {
      routes.myEvaluations().push();
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/mes-evaluations");
  });

  it("asks for confirmation before leaving the wizard with unsaved changes", () => {
    routes.updateSite({ siteId: "site-1" }).push();
    renderWithProviders(<SiteUpdateNavigationBlockerDialog shouldBlock={true} />);

    act(() => {
      routes.siteFeatures({ siteId: "site-1" }).push();
    });

    expect(
      screen.getByRole("heading", { name: /Êtes-vous sûr·e de vouloir quitter sans sauvegarder/ }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/sites/site-1/modifier");
  });

  it("completes the navigation when the user confirms leaving without saving", () => {
    routes.updateSite({ siteId: "site-1" }).push();
    renderWithProviders(<SiteUpdateNavigationBlockerDialog shouldBlock={true} />);
    act(() => {
      routes.siteFeatures({ siteId: "site-1" }).push();
    });

    fireEvent.click(screen.getByRole("button", { name: "Quitter sans sauvegarder" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/sites/site-1/caracteristiques");
  });

  it("keeps the user on the wizard, with their changes intact, when they cancel", () => {
    routes.updateSite({ siteId: "site-1" }).push();
    renderWithProviders(<SiteUpdateNavigationBlockerDialog shouldBlock={true} />);
    act(() => {
      routes.siteFeatures({ siteId: "site-1" }).push();
    });

    fireEvent.click(screen.getByRole("button", { name: "Reprendre la modification" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/sites/site-1/modifier");
  });

  it("lets the user move between steps of the wizard without confirming", () => {
    routes.updateSite({ siteId: "site-1" }).push();
    renderWithProviders(<SiteUpdateNavigationBlockerDialog shouldBlock={true} />);

    act(() => {
      routes.updateSite({ siteId: "site-1", etape: "pollution" }).push();
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.search).toBe("?etape=pollution");
  });
});
