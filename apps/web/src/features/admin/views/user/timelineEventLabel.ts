import type { ImpactsExportFormat, LifecycleEmailType } from "shared";

import type { AdminUserTimelineEvent } from "../../core/admin.types";

const quote = (name: string | null): string => (name ? ` « ${name} »` : "");

const getLifecycleEmailLabel = (
  emailType: LifecycleEmailType,
  entityName: string | null,
): string => {
  switch (emailType) {
    case "welcome":
      return "Email de bienvenue";
    case "first-site-reminder":
      return "Rappel : créer votre premier site";
    case "first-project-reminder":
      return `Rappel : créer votre premier projet pour le site${quote(entityName)}`;
    case "project-impacts-summary":
      return `Récapitulatif des impacts du projet${quote(entityName)}`;
  }
};

const getImpactsExportFormatLabel = (format: ImpactsExportFormat): string => {
  switch (format) {
    case "pdf":
      return "PDF";
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
      return getLifecycleEmailLabel(event.emailType, event.entityName);
    case "lifecycle_emails_unsubscribed":
      return "Désinscription des emails de rappel";
    case "impacts_exported":
      return `Impacts téléchargés (${getImpactsExportFormatLabel(event.impactsExportFormat)})${quote(event.entityName)}`;
  }
};
