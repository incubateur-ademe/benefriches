import type { AdminUserTimelineEvent } from "./admin.types";

const quote = (name: string | null): string => (name ? ` « ${name} »` : "");

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
  }
};
