import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";
import MyProjectsPageHeader from "./MyProjectsPageHeader";
import MyProjectsTourGuide from "./MyProjectTourGuide";
import ScenariiList from "./ScenariiList";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  projectsList: ReconversionProjectsGroupedBySite;
};

function MyProjectsPage({ loadingState, projectsList }: Props) {
  const getProjectListsPageContent = () => {
    if (loadingState === "loading") return <LoadingSpinner />;

    if (loadingState === "error")
      return (
        <Alert
          description="Une erreur est survenue lors du chargement de vos projets. Veuillez recharger la page."
          severity="error"
          title="Chargement des projets"
          className="fr-my-7v"
        />
      );

    if (loadingState === "success") {
      if (projectsList.length === 0) {
        return (
          <>
            <p>Vous n'avez pas encore de projets.</p>
            <p>Pour démarrer, créez le site sur lequel vous prévoyez votre projet.</p>
          </>
        );
      }

      return <ScenariiList projectsList={projectsList} />;
    }
    return null;
  };

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <MyProjectsTourGuide projectsList={projectsList}>
        <MyProjectsPageHeader />
        {getProjectListsPageContent()}
      </MyProjectsTourGuide>
    </section>
  );
}

export default MyProjectsPage;
