import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { vi } from "vitest";

import { RouteProvider } from "@/app/router";
import { createStore } from "@/app/store/store";
import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import OnboardingWelcomePage from "./OnboardingWelcomePage";

vi.mock("@/app/envVars", () => ({
  BENEFRICHES_ENV: { crispEnabled: true },
}));

function renderWithProviders(
  ui: React.ReactElement,
  supportChatService: InMemorySupportChatService,
) {
  const store = createStore(getTestAppDependencies({ supportChatService }));
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

describe("OnboardingWelcomePage", () => {
  it("opens support chat with a greeting message when the contact button is clicked", () => {
    const supportChatService = new InMemorySupportChatService();
    renderWithProviders(<OnboardingWelcomePage />, supportChatService);

    fireEvent.click(screen.getByRole("button", { name: "Contacter Mintsa" }));

    expect(supportChatService._messages).toEqual([
      "Bonjour Mintsa, j'ai une question sur mes premiers pas sur Bénéfriches.",
    ]);
  });
});
