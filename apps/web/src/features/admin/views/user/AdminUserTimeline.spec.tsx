import { render, screen } from "@testing-library/react";

import type { AdminUserTimelineEvent } from "../../core/admin.types";
import AdminUserTimeline from "./AdminUserTimeline";

describe("AdminUserTimeline", () => {
  const cases: { event: AdminUserTimelineEvent; label: string }[] = [
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "account_created",
        entityId: null,
        entityName: null,
      },
      label: "Création du compte",
    },
    {
      event: { date: "2026-01-10T10:00:00.000Z", type: "login", entityId: null, entityName: null },
      label: "Connexion",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "site_created",
        entityId: "s1",
        entityName: "Friche",
      },
      label: "Création du site « Friche »",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "site_updated",
        entityId: "s1",
        entityName: "Friche",
      },
      label: "Modification du site « Friche »",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "project_created",
        entityId: "p1",
        entityName: "Projet",
      },
      label: "Création du projet « Projet »",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "project_updated",
        entityId: "p1",
        entityName: "Projet",
      },
      label: "Modification du projet « Projet »",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "compatibility_evaluation_created",
        entityId: "e1",
        entityName: null,
      },
      label: "Évaluation de compatibilité lancée",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "compatibility_evaluation_completed",
        entityId: "e1",
        entityName: null,
      },
      label: "Évaluation de compatibilité terminée",
    },
  ];

  for (const { event, label } of cases) {
    it(`renders "${label}" for a ${event.type} event`, () => {
      render(<AdminUserTimeline events={[event]} />);

      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("renders events from most recent to oldest", () => {
    render(
      <AdminUserTimeline
        events={[
          {
            date: "2026-01-10T10:00:00.000Z",
            type: "account_created",
            entityId: null,
            entityName: null,
          },
          { date: "2026-03-05T10:00:00.000Z", type: "login", entityId: null, entityName: null },
        ]}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("Connexion"),
      expect.stringContaining("Création du compte"),
    ]);
  });
});
