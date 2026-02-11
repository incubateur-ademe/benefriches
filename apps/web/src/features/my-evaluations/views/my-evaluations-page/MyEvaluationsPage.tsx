import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { UserSiteEvaluation } from "../../domain/types";
import MyEvaluationItem from "./MyEvaluationItem";
import MyEvaluationsPageHeader from "./MyEvaluationsPageHeader";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  evaluations: UserSiteEvaluation[];
  onRemoveProjectFromList: (props: { siteId: string; projectId: string }) => void;
};

function MyEvaluationsPage({ loadingState, evaluations, onRemoveProjectFromList }: Props) {
  if (loadingState === "loading")
    return (
      <section className={fr.cx("fr-container", "fr-py-4w")}>
        <HtmlTitle>Chargement... - Mes évaluations</HtmlTitle>
        <MyEvaluationsPageHeader />
        <LoadingSpinner />
      </section>
    );

  if (loadingState === "error")
    return (
      <section className={fr.cx("fr-container", "fr-py-4w")}>
        <HtmlTitle>Erreur - Mes évaluations</HtmlTitle>
        <MyEvaluationsPageHeader />
        <Alert
          description="Une erreur est survenue lors du chargement de vos évaluations. Veuillez recharger la page."
          severity="error"
          title="Chargement des évaluations"
          className="my-7"
        />
      </section>
    );

  if (loadingState === "success") {
    return (
      <div className="bg-(--background-contrast-grey) h-full">
        <section className={fr.cx("fr-container", "fr-py-4w")}>
          <HtmlTitle>Mes évaluations</HtmlTitle>
          <MyEvaluationsPageHeader />
          {evaluations.length === 0 ? (
            <>
              <p>Vous n'avez pas encore d'évaluation.</p>
              <p>Pour réaliser votre première évaluation, cliquez sur “Évaluer un nouveau site”.</p>
            </>
          ) : (
            <div className="flex flex-col gap-10">
              {evaluations.map((evaluation) => (
                <MyEvaluationItem
                  key={evaluation.siteId}
                  evaluation={evaluation}
                  onRemoveProjectFromList={onRemoveProjectFromList}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default MyEvaluationsPage;
