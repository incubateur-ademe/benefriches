import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { RouteProvider, routes } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryLifecycleEmailsService } from "../../infrastructure/lifecycle-emails-service/InMemoryLifecycleEmailsService";
import UnsubscribePage from "./UnsubscribePage";
import UnsubscribePageContainer from "./index";

describe("UnsubscribePage", () => {
  it("shows the confirmation", () => {
    render(<UnsubscribePage viewData={{ status: "success" }} onRetry={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Désinscription confirmée" })).toBeVisible();
    expect(screen.getAllByRole("paragraph").map((paragraph) => paragraph.textContent)).toEqual([
      "Vous ne recevrez plus les e-mails d’accompagnement et de résultats d’impacts de Bénéfriches.",
      "Les e-mails de connexion que vous demandez continueront d’arriver.",
    ]);
    expect(screen.getByRole("link", { name: "Aller sur Bénéfriches" })).toBeVisible();
  });

  it("shows the invalid-link error", () => {
    render(
      <UnsubscribePage viewData={{ status: "error", reason: "invalid-link" }} onRetry={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "Ce lien de désinscription ne fonctionne pas" }),
    ).toBeVisible();
    expect(screen.getByText("Vos préférences n’ont pas été modifiées.")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Réessayer" })).toBeNull();
  });

  it("offers a retry on a technical error", () => {
    const onRetry = vi.fn();
    render(
      <UnsubscribePage viewData={{ status: "error", reason: "technical" }} onRetry={onRetry} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows the loading state", () => {
    render(<UnsubscribePage viewData={{ status: "loading" }} onRetry={vi.fn()} />);

    expect(screen.getByText("Désinscription en cours…")).toBeVisible();
  });

  it("shows the invalid-link error without calling the API when the link has no token", () => {
    const lifecycleEmailsService = new InMemoryLifecycleEmailsService();
    const store = createStore(getTestAppDependencies({ lifecycleEmailsService }));
    routes.lifecycleEmailsUnsubscribe().push();

    render(
      <RouteProvider>
        <Provider store={store}>
          <UnsubscribePageContainer />
        </Provider>
      </RouteProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Ce lien de désinscription ne fonctionne pas" }),
    ).toBeVisible();
    expect(lifecycleEmailsService._unsubscribedTokens).toEqual([]);
  });
});
