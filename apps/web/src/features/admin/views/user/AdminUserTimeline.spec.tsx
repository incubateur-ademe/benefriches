import { fireEvent, render, screen, within } from "@testing-library/react";

import type { AdminUserTimelineEvent } from "../../core/admin.types";
import { formatAdminDate } from "../formatAdminDate";
import AdminUserTimeline from "./AdminUserTimeline";

type EmailEvent = Extract<
  AdminUserTimelineEvent,
  { type: "lifecycle_email_sent" | "lifecycle_email_failed" }
>;

const sentEmailEvent = (
  emailType: EmailEvent["emailType"],
  entityName: string | null = null,
): AdminUserTimelineEvent => ({
  date: "2026-01-10T10:00:00.000Z",
  type: "lifecycle_email_sent",
  emailType,
  entityName,
});

const failedEmailEvent = (
  overrides: Partial<Omit<Extract<EmailEvent, { type: "lifecycle_email_failed" }>, "type">>,
): AdminUserTimelineEvent => ({
  date: "2026-01-10T10:00:00.000Z",
  type: "lifecycle_email_failed",
  emailType: "first-site-reminder",
  entityName: null,
  deliveryStatus: "failed",
  deliveryAttempts: 1,
  deliveryErrorMessage: null,
  ...overrides,
});

const LOGIN_EVENT: AdminUserTimelineEvent = {
  date: "2026-01-09T10:00:00.000Z",
  type: "login",
};

const SENT_WELCOME_EVENT = sentEmailEvent("welcome");

const UNSUBSCRIBED_EVENT: AdminUserTimelineEvent = {
  date: "2026-01-10T10:00:00.000Z",
  type: "lifecycle_emails_unsubscribed",
};

const failedEvent = (deliveryStatus: "failed" | "abandoned") =>
  failedEmailEvent({
    emailType: "first-site-reminder",
    deliveryStatus,
    deliveryAttempts: 2,
    deliveryErrorMessage: "Connection timeout",
  });

const impactsExportedEvent = (entityArchived: boolean): AdminUserTimelineEvent => ({
  date: "2026-01-10T10:00:00.000Z",
  type: "impacts_exported",
  entityId: "p1",
  entityName: "Quartier mixte",
  impactsExportFormat: "pdf",
  entityArchived,
});

const getTimelineItems = () =>
  within(screen.getByRole("list", { name: "Activité" })).getAllByRole("listitem");

describe("AdminUserTimeline", () => {
  const cases: { event: AdminUserTimelineEvent; label: string }[] = [
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "account_created",
      },
      label: "Création du compte",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "login",
      },
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
      },
      label: "Évaluation de compatibilité lancée",
    },
    {
      event: {
        date: "2026-01-10T10:00:00.000Z",
        type: "compatibility_evaluation_completed",
        entityId: "e1",
      },
      label: "Évaluation de compatibilité terminée",
    },
    { event: SENT_WELCOME_EVENT, label: "Email de bienvenue" },
    {
      event: sentEmailEvent("first-site-reminder"),
      label: "Rappel : créer votre premier site",
    },
    {
      event: sentEmailEvent("first-project-reminder", "Friche Duval"),
      label: "Rappel : créer votre premier projet pour le site « Friche Duval »",
    },
    {
      event: sentEmailEvent("first-project-reminder"),
      label: "Rappel : créer votre premier projet pour le site",
    },
    {
      event: failedEmailEvent({
        emailType: "project-impacts-summary",
        entityName: "Parking Sud",
        deliveryStatus: "failed",
        deliveryAttempts: 1,
      }),
      label: "Récapitulatif des impacts du projet « Parking Sud »",
    },
    {
      event: sentEmailEvent("project-impacts-summary"),
      label: "Récapitulatif des impacts du projet",
    },
    { event: UNSUBSCRIBED_EVENT, label: "Désinscription des emails de rappel" },
    {
      event: impactsExportedEvent(false),
      label: "Impacts téléchargés (PDF) « Quartier mixte »",
    },
  ];

  for (const { event, label } of cases) {
    it(`renders "${label}" for a ${event.type} event`, () => {
      render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[event]} />);

      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("renders events from most recent to oldest", () => {
    render(
      <AdminUserTimeline
        lifecycleEmailMaxAttempts={5}
        events={[
          {
            date: "2026-01-10T10:00:00.000Z",
            type: "account_created",
          },
          {
            date: "2026-03-05T10:00:00.000Z",
            type: "login",
          },
        ]}
      />,
    );

    const items = getTimelineItems();
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("Connexion"),
      expect.stringContaining("Création du compte"),
    ]);
  });

  describe("badges", () => {
    const badgeCases: { name: string; event: AdminUserTimelineEvent; badge: string }[] = [
      { name: "sent email", event: SENT_WELCOME_EVENT, badge: "Envoyé" },
      {
        name: "failed email",
        event: failedEvent("failed"),
        badge: "Échec · nouvelle tentative prévue",
      },
      { name: "abandoned email", event: failedEvent("abandoned"), badge: "Échec · abandonné" },
      { name: "unsubscribe", event: UNSUBSCRIBED_EVENT, badge: "Désinscription" },
      {
        name: "archived project impacts export",
        event: impactsExportedEvent(true),
        badge: "Archivé",
      },
    ];

    for (const { name, event, badge } of badgeCases) {
      it(`renders the "${badge}" badge for a ${name} event`, () => {
        render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[event]} />);

        expect(screen.getByText(badge)).toBeInTheDocument();
      });
    }

    it("renders no badge for activity events", () => {
      render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[LOGIN_EVENT]} />);

      const item = getTimelineItems()[0]!;
      expect(within(item).getByText("Connexion")).toBeInTheDocument();
      expect(item.textContent).toEqual(`${formatAdminDate(LOGIN_EVENT.date)}Connexion`);
    });

    it("renders no badge for the impacts export of an active project", () => {
      const event = impactsExportedEvent(false);
      render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[event]} />);

      expect(getTimelineItems()[0]!.textContent).toEqual(
        `${formatAdminDate(event.date)}Impacts téléchargés (PDF) « Quartier mixte »`,
      );
    });
  });

  describe("detail line", () => {
    for (const status of ["failed", "abandoned"] as const) {
      it(`renders the attempt count and error message for a ${status} email`, () => {
        render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[failedEvent(status)]} />);

        expect(screen.getByText("Tentative 2 sur 5 · Connection timeout")).toBeInTheDocument();
      });
    }

    it("explains the unsubscribe event", () => {
      render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[UNSUBSCRIBED_EVENT]} />);

      expect(
        screen.getByText("Plus aucun email de rappel ne sera envoyé à cet utilisateur."),
      ).toBeInTheDocument();
    });
  });

  describe("marker", () => {
    const markerCases: { name: string; event: AdminUserTimelineEvent; marker: string }[] = [
      { name: "login", event: LOGIN_EVENT, marker: "Activité" },
      { name: "sent email", event: SENT_WELCOME_EVENT, marker: "Email" },
      { name: "unsubscribe", event: UNSUBSCRIBED_EVENT, marker: "Email" },
      { name: "impacts export", event: impactsExportedEvent(false), marker: "Activité" },
      { name: "failed email", event: failedEvent("failed"), marker: "Email en échec" },
      { name: "abandoned email", event: failedEvent("abandoned"), marker: "Email en échec" },
    ];

    for (const { name, event, marker } of markerCases) {
      it(`renders the "${marker}" marker for a ${name} event`, () => {
        render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[event]} />);

        expect(
          within(getTimelineItems()[0]!).getByRole("img", { name: marker }),
        ).toBeInTheDocument();
      });
    }
  });

  describe("filter", () => {
    it("shows all events by default", () => {
      render(
        <AdminUserTimeline
          lifecycleEmailMaxAttempts={5}
          events={[LOGIN_EVENT, SENT_WELCOME_EVENT]}
        />,
      );

      expect(screen.getByRole("button", { name: "Tout" })).toHaveAttribute("aria-pressed", "true");
      expect(getTimelineItems()).toHaveLength(2);
    });

    it("shows only activity events when Activité is selected", () => {
      render(
        <AdminUserTimeline
          lifecycleEmailMaxAttempts={5}
          events={[LOGIN_EVENT, SENT_WELCOME_EVENT]}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "Activité" }));

      const items = getTimelineItems();
      expect(items).toHaveLength(1);
      expect(within(items[0]!).getByText("Connexion")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Activité" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("shows only email events when Emails is selected", () => {
      render(
        <AdminUserTimeline
          lifecycleEmailMaxAttempts={5}
          events={[LOGIN_EVENT, SENT_WELCOME_EVENT]}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "Emails" }));

      const items = getTimelineItems();
      expect(items).toHaveLength(1);
      expect(within(items[0]!).getByText("Email de bienvenue")).toBeInTheDocument();
    });

    it("shows all events again when Tout is selected after filtering", () => {
      render(
        <AdminUserTimeline
          lifecycleEmailMaxAttempts={5}
          events={[LOGIN_EVENT, SENT_WELCOME_EVENT]}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "Emails" }));
      fireEvent.click(screen.getByRole("button", { name: "Tout" }));

      expect(getTimelineItems()).toHaveLength(2);
    });

    it("renders the empty message when the filter leaves no event", () => {
      render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[LOGIN_EVENT]} />);

      fireEvent.click(screen.getByRole("button", { name: "Emails" }));

      expect(screen.getByText("Aucune activité enregistrée.")).toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Activité" })).not.toBeInTheDocument();
    });
  });

  it("renders two identical events at the same instant", () => {
    render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[LOGIN_EVENT, LOGIN_EVENT]} />);

    fireEvent.click(screen.getByRole("button", { name: "Activité" }));
    fireEvent.click(screen.getByRole("button", { name: "Tout" }));

    expect(getTimelineItems()).toHaveLength(2);
  });

  it("renders the empty message when the user has no event", () => {
    render(<AdminUserTimeline lifecycleEmailMaxAttempts={5} events={[]} />);

    expect(screen.getByText("Aucune activité enregistrée.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tout" })).not.toBeInTheDocument();
  });
});
