import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import Table from "@codegouvfr/react-dsfr/Table";
import { useForm } from "react-hook-form";

import { routes } from "@/app/router";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { AdminUsersViewData } from "../../core/admin.selectors";
import { formatAdminDate } from "../formatAdminDate";

type Props = {
  viewData: AdminUsersViewData;
  onSearchSubmitted: (search: string) => void;
};

type SearchFormValues = { search: string };

const USERS_TABLE_HEADERS = [
  "Email",
  "Prénom Nom",
  "Structure",
  "Date de création",
  "Dernière connexion",
];

function AdminUsersPage({ viewData, onSearchSubmitted }: Props) {
  const { loadingState, users, total, page, pageCount, search } = viewData;
  const { register, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: { search },
  });

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Utilisateurs - Administration</HtmlTitle>
      <a {...routes.admin().link} className="fr-link fr-icon-arrow-left-line fr-link--icon-left">
        Administration
      </a>
      <h1 className="mt-4">Utilisateurs</h1>

      <form
        className="flex flex-wrap items-end gap-4 mb-6"
        onSubmit={handleSubmit((values) => {
          onSearchSubmitted(values.search.trim());
        })}
      >
        <Input
          label="Rechercher un utilisateur"
          hintText="Email, nom ou structure"
          className="mb-0 grow max-w-xl"
          nativeInputProps={{ ...register("search"), type: "search" }}
        />
        <Button type="submit" iconId="fr-icon-search-line">
          Rechercher
        </Button>
      </form>

      {loadingState === "loading" && <LoadingSpinner />}

      {loadingState === "error" && (
        <Alert
          severity="error"
          title="Chargement des utilisateurs"
          description="Une erreur est survenue lors du chargement des utilisateurs. Veuillez recharger la page."
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
              caption="Liste des utilisateurs"
              noCaption
              headers={USERS_TABLE_HEADERS}
              data={users.map((user) => [
                <a key={user.id} {...routes.adminUser({ userId: user.id }).link}>
                  {user.email}
                </a>,
                [user.firstName, user.lastName].filter(Boolean).join(" ") || "-",
                user.structureName ?? "-",
                formatAdminDate(user.createdAt),
                formatAdminDate(user.lastLoginAt),
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
                routes.adminUsers({ search: search || undefined, page: pageNumber }).link
              }
            />
          )}
        </>
      )}
    </section>
  );
}

export default AdminUsersPage;
