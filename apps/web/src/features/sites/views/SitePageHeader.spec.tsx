import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import SitePageHeader from "./SitePageHeader";

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

describe("SitePageHeader", () => {
  it("offers the Modifier action in the site page menu", () => {
    renderWithProviders(
      <SitePageHeader
        siteId="site-1"
        siteName="Mon site"
        siteNature="FRICHE"
        isExpressSite={false}
        isEditable
        notEditableReason={null}
        onSuccessArchiveSite={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Voir plus de fonctionnalités" }));

    const updateMenuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    expect(updateMenuItem).toHaveAttribute("href", "/sites/site-1/modifier?from=%22site%22");

    expect(screen.getByRole("menuitem", { name: /Supprimer le site/ })).toBeInTheDocument();
  });
});
