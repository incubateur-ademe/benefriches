import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Table from "@codegouvfr/react-dsfr/Table";
import type { ReactNode } from "react";

import { routes } from "@/app/router";
import { getSiteNatureLabel } from "@/shared/core/label-mapping/siteNatureLabelMapping";
import {
  getUserStructureActivityLabel,
  getUserStructureTypeLabel,
} from "@/shared/core/label-mapping/userStructureLabelMapping";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { AdminUserViewData } from "../../core/admin.selectors";
import type { AdminUserActivity } from "../../core/admin.types";
import AdminAccessDeniedAlert from "../AdminAccessDeniedAlert";
import { formatAdminDate } from "../formatAdminDate";
import AdminUserTimeline from "./AdminUserTimeline";
import { getCompatibilityEvaluationStatusLabel } from "./compatibilityEvaluationStatusLabel";
import { getProjectCreationModeLabel } from "./projectCreationModeLabel";

type Props = {
  viewData: AdminUserViewData;
};

const SITES_HEADERS = [
  "Nom",
  "Id",
  "Nature",
  "Mode de création",
  "Statut",
  "Créé le",
  "Modifié le",
];
const PROJECTS_HEADERS = ["Nom", "Id", "Site", "Mode", "Statut", "Créé le", "Modifié le"];
const EVALUATIONS_HEADERS = ["Id", "Site", "Statut", "Créée le", "Terminée le"];

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-(--text-mention-grey)">{label}</dt>
      <dd className="m-0 font-medium break-all">{children}</dd>
    </div>
  );
}

function UserInfo({ user }: { user: AdminUserActivity["user"] }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-lg border border-border-grey p-6 mb-10">
      <InfoItem label="Prénom">{user.firstName ?? "-"}</InfoItem>
      <InfoItem label="Nom">{user.lastName ?? "-"}</InfoItem>
      <InfoItem label="Email">{user.email}</InfoItem>
      <InfoItem label="Structure">
        {user.structureName ?? "-"}
        <span className="block text-sm font-normal text-(--text-mention-grey)">
          {`${getUserStructureTypeLabel(user.structureType)} · ${getUserStructureActivityLabel(user.structureActivity)}`}
        </span>
      </InfoItem>
      <InfoItem label="Newsletter">
        {user.subscribedToNewsletter ? "Abonné" : "Non abonné"}
      </InfoItem>
      <InfoItem label="Créé le">{formatAdminDate(user.createdAt)}</InfoItem>
      <InfoItem label="Dernière connexion">{formatAdminDate(user.lastLoginAt)}</InfoItem>
      <InfoItem label="Nombre de connexions">{user.loginCount}</InfoItem>
      <InfoItem label="Id">{user.id}</InfoItem>
    </dl>
  );
}

function AdminUserPage({ viewData }: Props) {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Utilisateur - Administration</HtmlTitle>
      <a
        {...routes.adminUsers().link}
        className="fr-link fr-icon-arrow-left-line fr-link--icon-left"
      >
        Utilisateurs
      </a>

      {viewData.loadingState === "loading" && (
        <>
          <h1 className="mt-4">Utilisateur</h1>
          <LoadingSpinner />
        </>
      )}

      {viewData.loadingState === "forbidden" && (
        <>
          <h1 className="mt-4">Utilisateur</h1>
          <AdminAccessDeniedAlert />
        </>
      )}

      {viewData.loadingState === "not_found" && (
        <>
          <h1 className="mt-4">Utilisateur</h1>
          <Alert
            severity="warning"
            title="Utilisateur introuvable"
            description="Aucun utilisateur ne correspond à cet identifiant."
          />
        </>
      )}

      {viewData.loadingState === "error" && (
        <>
          <h1 className="mt-4">Utilisateur</h1>
          <Alert
            severity="error"
            title="Chargement de l'utilisateur"
            description="Une erreur est survenue lors du chargement de l'utilisateur. Veuillez recharger la page."
          />
        </>
      )}

      {viewData.loadingState === "success" && (
        <>
          <h1 className="mt-4">{viewData.activity.user.email}</h1>
          <UserInfo user={viewData.activity.user} />

          <AdminUserTimeline
            events={viewData.activity.timeline}
            lifecycleEmailMaxAttempts={viewData.activity.lifecycleEmailMaxAttempts}
          />

          <h2 className="text-xl mt-10">Sites</h2>
          {viewData.activity.sites.length === 0 ? (
            <p>Aucun site.</p>
          ) : (
            <Table
              caption="Sites de l'utilisateur"
              noCaption
              headers={SITES_HEADERS}
              data={viewData.activity.sites.map((site) => [
                <a key={site.id} {...routes.siteFeatures({ siteId: site.id }).link}>
                  {site.name}
                </a>,
                site.id,
                getSiteNatureLabel(site.nature),
                site.creationMode,
                site.status,
                formatAdminDate(site.createdAt),
                formatAdminDate(site.updatedAt),
              ])}
            />
          )}

          <h2 className="text-xl mt-10">Projets</h2>
          {viewData.activity.projects.length === 0 ? (
            <p>Aucun projet.</p>
          ) : (
            <Table
              caption="Projets de l'utilisateur"
              noCaption
              headers={PROJECTS_HEADERS}
              data={viewData.activity.projects.map((project) => [
                <a key={project.id} {...routes.projectImpacts({ projectId: project.id }).link}>
                  {project.name}
                </a>,
                project.id,
                project.siteId,
                getProjectCreationModeLabel(project.creationMode),
                project.status,
                formatAdminDate(project.createdAt),
                formatAdminDate(project.updatedAt),
              ])}
            />
          )}

          <h2 className="text-xl mt-10">Évaluations de compatibilité</h2>
          {viewData.activity.compatibilityEvaluations.length === 0 ? (
            <p>Aucune évaluation de compatibilité.</p>
          ) : (
            <Table
              caption="Évaluations de compatibilité de l'utilisateur"
              noCaption
              headers={EVALUATIONS_HEADERS}
              data={viewData.activity.compatibilityEvaluations.map((evaluation) => [
                evaluation.id,
                evaluation.siteId ?? "-",
                getCompatibilityEvaluationStatusLabel(evaluation.status),
                formatAdminDate(evaluation.createdAt),
                formatAdminDate(evaluation.completedAt),
              ])}
            />
          )}
        </>
      )}
    </section>
  );
}

export default AdminUserPage;
