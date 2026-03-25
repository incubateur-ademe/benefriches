import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import ProjectTile from "@/shared/views/components/ProjectTile/ProjectTile";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { UserSiteEvaluation } from "../../domain/types";
import MyEvaluationItem from "./MyEvaluationItem";
import MyEvaluationsPageHeader from "./MyEvaluationsPageHeader";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  evaluations: UserSiteEvaluation[];
  onRemoveProjectFromList: (props: { siteId: string; projectId: string }) => void;
  onRemoveSiteFromList: (siteId: string) => void;
};

function MyEvaluationsPage({
  loadingState,
  evaluations,
  onRemoveProjectFromList,
  onRemoveSiteFromList,
}: Props) {
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
          <MyEvaluationsPageHeader displayActions={evaluations.length > 0} />
          {evaluations.length === 0 ? (
            <>
              <p className="py-5 text-xl">Vous n'avez pas encore d'évaluation.</p>
              <div className="grid grid-cols-2 gap-6">
                <ProjectTile
                  linkProps={routes.createSite({ creationMode: "custom" }).link}
                  variant="dashed"
                  className={classNames(
                    "w-full h-60 justify-center text-blue-france dark:text-blue-light text-lg p-8",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames("fr-icon--xl", fr.cx("fr-icon-add-line"))}
                  />
                  Évaluer mon site
                  <Badge style="green-emeraude" small>
                    Analyse des impacts socio-économiques
                  </Badge>
                </ProjectTile>
                <ProjectTile
                  className={classNames(
                    "w-full h-60 justify-center text-blue-france dark:text-blue-light text-lg p-8",
                  )}
                  variant="dashed"
                  linkProps={routes.createSite({ creationMode: "demo" }).link}
                >
                  <span
                    aria-hidden="true"
                    className={classNames("fr-icon--xl", "fr-icon-mode-demo")}
                  />
                  Évaluer un site et un projet démo
                  <Badge style="grey" small>
                    Découverte de l’outil en 30 secondes
                  </Badge>
                </ProjectTile>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-10">
              {evaluations.map((evaluation) => (
                <MyEvaluationItem
                  key={evaluation.siteId}
                  evaluation={evaluation}
                  onRemoveProjectFromList={onRemoveProjectFromList}
                  onRemoveSiteFromList={() => {
                    onRemoveSiteFromList(evaluation.siteId);
                  }}
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
