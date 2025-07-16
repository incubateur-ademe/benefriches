import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";
import MyProjectsTourGuide from "./MyProjectTourGuide";
import MyProjectsPageHeader from "./MyProjectsPageHeader";
import ScenariiList from "./ScenariiList";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  projectsList: ReconversionProjectsGroupedBySite;
};

function MyProjectsPage({ loadingState, projectsList }: Props) {
  if (loadingState === "loading")
    return (
      <section className={fr.cx("fr-container", "fr-py-4w")}>
        <HtmlTitle>Chargement... - Mes projets</HtmlTitle>
        <MyProjectsPageHeader />
        <LoadingSpinner />
      </section>
    );

  if (loadingState === "error")
    return (
      <section className={fr.cx("fr-container", "fr-py-4w")}>
        <HtmlTitle>Erreur - Mes projets</HtmlTitle>
        <MyProjectsPageHeader />
        <Alert
          description="Une erreur est survenue lors du chargement de vos projets. Veuillez recharger la page."
          severity="error"
          title="Chargement des projets"
          className="tw-my-7"
        />
      </section>
    );

  if (loadingState === "success") {
    return (
      <section className={fr.cx("fr-container", "fr-py-4w")}>
        <HtmlTitle>Mes projets</HtmlTitle>
        <MyProjectsTourGuide projectsList={projectsList}>
          <MyProjectsPageHeader />
          {projectsList.length === 0 ? (
            <>
              <p>Vous n'avez pas encore de projets.</p>
              <p>Pour démarrer, créez le site sur lequel vous prévoyez votre projet.</p>
            </>
          ) : (
            <ScenariiList projectsList={projectsList} />
          )}
        </MyProjectsTourGuide>
      </section>
    );
  }
}

export default MyProjectsPage;
