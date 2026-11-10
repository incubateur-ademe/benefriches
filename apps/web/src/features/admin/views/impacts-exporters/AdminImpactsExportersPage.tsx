import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import Table from "@codegouvfr/react-dsfr/Table";

import { routes } from "@/app/router";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { AdminImpactsExportersViewData } from "../../core/admin.selectors";
import AdminAccessDeniedAlert from "../AdminAccessDeniedAlert";
import AdminUserSearchForm from "../AdminUserSearchForm";
import { formatAdminDate } from "../formatAdminDate";

type Props = {
  viewData: AdminImpactsExportersViewData;
  onSearchSubmitted: (search: string) => void;
};

const IMPACTS_EXPORTERS_TABLE_HEADERS = [
  "Email",
  "Prénom Nom",
  "Structure",
  "Exports d'impacts",
  "Projets exportés",
  "Dernier export",
];

function AdminImpactsExportersPage({ viewData, onSearchSubmitted }: Props) {
  const { loadingState, users, total, page, pageCount, search } = viewData;

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Exports d'impacts - Administration</HtmlTitle>
      <a {...routes.admin().link} className="fr-link fr-icon-arrow-left-line fr-link--icon-left">
        Administration
      </a>
      <h1 className="mt-4">Exports d'impacts</h1>
      <p>Utilisateurs ayant téléchargé au moins un export des impacts d'un projet.</p>

      <AdminUserSearchForm search={search} onSearchSubmitted={onSearchSubmitted} />

      {loadingState === "loading" && <LoadingSpinner />}

      {loadingState === "forbidden" && <AdminAccessDeniedAlert />}

      {loadingState === "error" && (
        <Alert
          severity="error"
          title="Chargement des exports d'impacts"
          description="Une erreur est survenue lors du chargement des exports d'impacts. Veuillez recharger la page."
        />
      )}

      {loadingState === "success" && (
        <>
          <p className="text-(--text-mention-grey)">
            {total} utilisateur{total > 1 ? "s" : ""}
            {search ? ` pour « ${search} »` : ""}
          </p>
          {users.length === 0 ? (
            <p>Aucun utilisateur trouvé.</p>
          ) : (
            <Table
              caption="Liste des utilisateurs ayant exporté des impacts"
              noCaption
              headers={IMPACTS_EXPORTERS_TABLE_HEADERS}
              data={users.map((user) => [
                <a key={user.id} {...routes.adminUser({ userId: user.id }).link}>
                  {user.email}
                </a>,
                [user.firstName, user.lastName].filter(Boolean).join(" ") || "-",
                user.structureName ?? "-",
                user.impactsExportsCount,
                user.exportedProjectsCount,
                formatAdminDate(user.lastImpactsExportedAt),
              ])}
            />
          )}
          {pageCount > 1 && (
            <Pagination
              key={`${search}-${page}`}
              count={pageCount}
              defaultPage={page}
              showFirstLast
              getPageLinkProps={(pageNumber) =>
                routes.adminImpactsExporters({ search: search || undefined, page: pageNumber }).link
              }
            />
          )}
        </>
      )}
    </section>
  );
}

export default AdminImpactsExportersPage;
