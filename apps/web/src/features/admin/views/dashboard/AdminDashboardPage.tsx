import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Table from "@codegouvfr/react-dsfr/Table";

import { routes } from "@/app/router";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { AdminDashboardStats, AdminLoadingState } from "../../core/admin.types";
import AdminAccessDeniedAlert from "../AdminAccessDeniedAlert";
import { formatAdminMonth } from "../formatAdminDate";

type Props = {
  loadingState: AdminLoadingState;
  stats: AdminDashboardStats | null;
};

const MONTHLY_TABLE_HEADERS = ["Mois", "Comptes", "Sites", "Projets", "Évaluations", "Connexions"];

function StatCard({ label, value, total }: { label: string; value: number; total?: number }) {
  return (
    <div className="rounded-lg border border-border-grey bg-white dark:bg-dsfr-contrast-grey p-6">
      <p className="mb-1 text-sm text-(--text-mention-grey)">{label}</p>
      <p className="mb-0 text-3xl font-bold">{value.toLocaleString("fr-FR")}</p>
      {total !== undefined && (
        <p className="mb-0 mt-1 text-sm text-(--text-mention-grey)">
          Total : {total.toLocaleString("fr-FR")}
        </p>
      )}
    </div>
  );
}

function AdminDashboardPage({ loadingState, stats }: Props) {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Administration</HtmlTitle>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="mb-0">Administration</h1>
        <Button
          priority="secondary"
          iconId="fr-icon-user-line"
          linkProps={routes.adminUsers().link}
        >
          Voir les utilisateurs
        </Button>
      </div>

      {loadingState === "loading" && <LoadingSpinner />}

      {loadingState === "forbidden" && <AdminAccessDeniedAlert />}

      {loadingState === "error" && (
        <Alert
          severity="error"
          title="Chargement des statistiques"
          description="Une erreur est survenue lors du chargement des statistiques. Veuillez recharger la page."
        />
      )}

      {loadingState === "success" && stats && (
        <>
          <h2 className="text-xl">Ce mois-ci</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-10">
            <StatCard
              label="Comptes créés"
              value={stats.currentMonth.usersCreated}
              total={stats.totals.users}
            />
            <StatCard
              label="Sites créés"
              value={stats.currentMonth.sitesCreated}
              total={stats.totals.sites}
            />
            <StatCard
              label="Projets créés"
              value={stats.currentMonth.projectsCreated}
              total={stats.totals.projects}
            />
            <StatCard
              label="Évaluations de compatibilité"
              value={stats.currentMonth.compatibilityEvaluationsCreated}
              total={stats.totals.compatibilityEvaluations}
            />
            <StatCard label="Connexions" value={stats.currentMonth.logins} />
          </div>

          <h2 className="text-xl">12 derniers mois</h2>
          <Table
            caption="Activité mensuelle sur les 12 derniers mois"
            noCaption
            headers={MONTHLY_TABLE_HEADERS}
            data={stats.monthly.map((month) => [
              formatAdminMonth(month.month),
              month.usersCreated,
              month.sitesCreated,
              month.projectsCreated,
              month.compatibilityEvaluationsCreated,
              month.logins,
            ])}
          />
        </>
      )}
    </section>
  );
}

export default AdminDashboardPage;
