import { fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
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
  preloadedState?: Parameters<typeof createStore>[1],
) {
  const store = createStore(getTestAppDependencies({ supportChatService }), preloadedState);
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

  it("shows a heading personalized with the current user's name", () => {
    const supportChatService = new InMemorySupportChatService();
    renderWithProviders(<OnboardingWelcomePage />, supportChatService, {
      currentUser: {
        currentUser: {
          id: "301d0f47-3775-4320-8e06-381047bebbed",
          email: "john.doe@mail.com",
          firstName: "John",
          lastName: "Doe",
          structureType: "company",
          structureActivity: "photovoltaic_plants_developer",
        },
        currentUserState: "authenticated",
        createUserState: "idle",
      },
    });

    expect(screen.getByRole("heading", { name: "Bonjour, John Doe !" })).toBeVisible();
  });
});
