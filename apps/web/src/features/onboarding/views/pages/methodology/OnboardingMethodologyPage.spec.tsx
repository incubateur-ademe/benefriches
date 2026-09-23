import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider } from "@/app/router";
import { createStore } from "@/app/store/store";
import AppHeader from "@/shared/views/layout/AppLayout/AppHeader";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import OnboardingMethodologyPage from "./OnboardingMethodologyPage";

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

describe("OnboardingMethodologyPage", () => {
  it("uses the Questions fréquentes dialog as the notice button disclosure target", () => {
    renderWithProviders(
      <>
        <AppHeader />
        <OnboardingMethodologyPage />
      </>,
    );

    const noticeButton = screen.getByRole("button", { name: "cette notice" });
    const faqDialog = screen.getByRole("dialog", { hidden: true });

    expect(noticeButton).toHaveAttribute("aria-controls", faqDialog.id);
    expect(noticeButton).toHaveAttribute("data-fr-opened", "false");
    expect(faqDialog).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("heading", { name: "Questions fréquentes", hidden: true }).id,
    );
  });
});
