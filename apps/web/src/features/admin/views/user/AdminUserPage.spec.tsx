import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import type { AdminUserActivity } from "../../core/admin.types";
import { InMemoryAdminService } from "../../infrastructure/admin-service/InMemoryAdminService";
import AdminUserPageContainer from "./index";

const USER_ACTIVITY: AdminUserActivity = {
  user: {
    id: "user-1",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    structureName: "Mairie de Lyon",
    structureType: "local_authority",
    structureActivity: "municipality",
    createdAt: "2026-01-10T10:00:00.000Z",
    lastLoginAt: "2026-09-01T08:30:00.000Z",
    loginCount: 7,
    subscribedToNewsletter: true,
  },
  timeline: [],
  sites: [
    {
      id: "site-1",
      name: "Ferme Martin",
      nature: "AGRICULTURAL_OPERATION",
      creationMode: "custom",
      status: "active",
      createdAt: "2026-02-01T09:00:00.000Z",
      updatedAt: null,
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Projet importé",
      siteId: "site-1",
      creationMode: "csv-import",
      status: "active",
      createdAt: "2026-03-01T09:00:00.000Z",
      updatedAt: null,
    },
  ],
  compatibilityEvaluations: [
    {
      id: "evaluation-1",
      siteId: "site-1",
      status: "related_site_created",
      createdAt: "2026-01-20T09:00:00.000Z",
      completedAt: "2026-01-21T09:00:00.000Z",
    },
  ],
  lifecycleEmailMaxAttempts: 5,
};

const renderPage = (adminService: InMemoryAdminService) =>
  render(
    <Provider store={createStore(getTestAppDependencies({ adminService }))}>
      <AdminUserPageContainer userId="user-1" />
    </Provider>,
  );

describe("AdminUserPage", () => {
  it('shows "Accès réservé" when the admin API answers 403', async () => {
    renderPage(new InMemoryAdminService({ shouldDenyAccess: true }));

    expect(await screen.findByText("Accès réservé aux administrateurs")).toBeInTheDocument();
    expect(screen.queryByText("Chargement de l'utilisateur")).not.toBeInTheDocument();
  });

  it("shows a loading state before the user is loaded", () => {
    renderPage(new InMemoryAdminService({ userActivities: { "user-1": USER_ACTIVITY } }));

    expect(screen.getByRole("heading", { level: 1, name: "Utilisateur" })).toBeInTheDocument();
    expect(screen.queryByText(USER_ACTIVITY.user.email)).not.toBeInTheDocument();
  });

  it("shows French labels for the user's sites, projects, evaluations and structure", async () => {
    renderPage(new InMemoryAdminService({ userActivities: { "user-1": USER_ACTIVITY } }));

    await screen.findByRole("heading", { level: 1, name: "jane@example.com" });

    expect(screen.getByText("Collectivité · Mairie")).toBeInTheDocument();
    expect(screen.getByText("Exploitation agricole")).toBeInTheDocument();
    expect(screen.getByText("Import CSV")).toBeInTheDocument();
    expect(screen.getByText("Site créé")).toBeInTheDocument();
  });

  it("shows the company structure with the urban planner activity", async () => {
    const companyActivity: AdminUserActivity = {
      ...USER_ACTIVITY,
      user: { ...USER_ACTIVITY.user, structureType: "company", structureActivity: "urban_planner" },
    };
    renderPage(new InMemoryAdminService({ userActivities: { "user-1": companyActivity } }));

    await screen.findByRole("heading", { level: 1, name: "jane@example.com" });

    expect(screen.getByText("Entreprise · Aménageur")).toBeInTheDocument();
  });
});
