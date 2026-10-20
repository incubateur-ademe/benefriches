import type { AdminUserTimelineEvent } from "../../core/admin.types";

const quote = (name: string | null): string => (name ? ` « ${name} »` : "");

const getLifecycleEmailLabel = (event: AdminUserTimelineEvent): string => {
  switch (event.emailType) {
    case "welcome":
      return "Email de bienvenue";
    case "first-site-reminder":
      return "Rappel : créer votre premier site";
    case "first-project-reminder":
      return `Rappel : créer votre premier projet pour le site${quote(event.entityName)}`;
    case "project-impacts-summary":
      return `Récapitulatif des impacts du projet${quote(event.entityName)}`;
    case null:
      return "";
  }
};

export const getTimelineEventLabel = (event: AdminUserTimelineEvent): string => {
  switch (event.type) {
    case "account_created":
      return "Création du compte";
    case "login":
      return "Connexion";
    case "site_created":
      return `Création du site${quote(event.entityName)}`;
    case "site_updated":
      return `Modification du site${quote(event.entityName)}`;
    case "project_created":
      return `Création du projet${quote(event.entityName)}`;
    case "project_updated":
      return `Modification du projet${quote(event.entityName)}`;
    case "compatibility_evaluation_created":
      return "Évaluation de compatibilité lancée";
    case "compatibility_evaluation_completed":
      return "Évaluation de compatibilité terminée";
    case "lifecycle_email_sent":
    case "lifecycle_email_failed":
      return getLifecycleEmailLabel(event);
    case "lifecycle_emails_unsubscribed":
      return "Désinscription des emails de rappel";
  }
};
