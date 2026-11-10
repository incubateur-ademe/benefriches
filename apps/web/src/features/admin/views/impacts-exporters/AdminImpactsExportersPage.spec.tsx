import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import type { AdminImpactsExporter, AdminImpactsExportersList } from "../../core/admin.types";
import { InMemoryAdminService } from "../../infrastructure/admin-service/InMemoryAdminService";
import AdminImpactsExportersPageContainer from "./index";

const JANE: AdminImpactsExporter = {
  id: "user-1",
  email: "jane@example.com",
  firstName: "Jane",
  lastName: "Doe",
  structureName: "Mairie de Lyon",
  impactsExportsCount: 4,
  exportedProjectsCount: 2,
  lastImpactsExportedAt: "2026-10-15T12:00:00.000Z",
};

const renderPage = (
  impactsExportersList: AdminImpactsExportersList,
  props: { search?: string; page?: number } = {},
) => {
  const adminService = new InMemoryAdminService({ impactsExportersList });
  render(
    <Provider store={createStore(getTestAppDependencies({ adminService }))}>
      <AdminImpactsExportersPageContainer {...props} />
    </Provider>,
  );
};

describe("AdminImpactsExportersPage", () => {
  it("shows one row per user with their impacts exports figures", async () => {
    renderPage({ users: [JANE], total: 1, page: 1, pageSize: 25 });

    const row = await screen.findByRole("row", { name: /jane@example.com/ });
    expect(
      within(row)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual([
      "jane@example.com",
      "Jane Doe",
      "Mairie de Lyon",
      "4",
      "2",
      expect.stringMatching(/^15\/10\/2026 \d{2}:\d{2}$/),
    ]);
    expect(screen.getByText("1 utilisateur")).toBeInTheDocument();
  });

  it("links each row to the user's admin page", async () => {
    renderPage({ users: [JANE], total: 1, page: 1, pageSize: 25 });

    expect(await screen.findByRole("link", { name: "jane@example.com" })).toHaveAttribute(
      "href",
      "/admin/utilisateurs/user-1",
    );
  });

  it("shows an empty message when no user has exported impacts", async () => {
    renderPage({ users: [], total: 0, page: 1, pageSize: 25 });

    expect(await screen.findByText("Aucun utilisateur trouvé.")).toBeInTheDocument();
  });

  it("shows the current search in the field and in the results count", async () => {
    renderPage({ users: [JANE], total: 1, page: 1, pageSize: 25 }, { search: "jane" });

    expect(await screen.findByText("1 utilisateur pour « jane »")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /Rechercher un utilisateur/ })).toHaveValue(
      "jane",
    );
  });

  it("navigates to the exports page filtered by the submitted search, back to the first page", async () => {
    window.history.replaceState(null, "", "/admin/exports?page=2");
    renderPage({ users: [JANE], total: 1, page: 2, pageSize: 25 }, { page: 2 });

    fireEvent.change(screen.getByRole("searchbox", { name: /Rechercher un utilisateur/ }), {
      target: { value: "  lyon  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Rechercher" }));

    await waitFor(() => {
      expect(`${window.location.pathname}${window.location.search}`).toBe(
        "/admin/exports?search=lyon",
      );
    });
  });

  it("links pagination pages to the exports page, keeping the search", async () => {
    renderPage({ users: [JANE], total: 60, page: 1, pageSize: 25 }, { search: "jane" });

    expect(await screen.findByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/admin/exports?search=jane&page=3",
    );
  });

  it('shows "Accès réservé" when the admin API answers 403', async () => {
    const adminService = new InMemoryAdminService({ shouldDenyAccess: true });
    render(
      <Provider store={createStore(getTestAppDependencies({ adminService }))}>
        <AdminImpactsExportersPageContainer />
      </Provider>,
    );

    expect(await screen.findByText("Accès réservé aux administrateurs")).toBeInTheDocument();
  });
});
