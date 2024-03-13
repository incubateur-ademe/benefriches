import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";
import MyProjectsPageHeader from "./MyProjectsPageHeader";
import ScenariiList from "./ScenariiList";

type Props = {
  loadingState: "idle" | "loading" | "error" | "success";
  projectsList: ReconversionProjectsGroupedBySite;
};

function MyProjectsPage({ loadingState, projectsList }: Props) {
  const getProjectListsPageContent = () => {
    if (loadingState === "loading") return <p>Chargement de vos projets...</p>;

    if (loadingState === "error")
      return (
        <p>
          Une erreur est survenue lors du chargement de vos projets. Veuillez recharger la page.
        </p>
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
    <>
      <MyProjectsPageHeader />
      {getProjectListsPageContent()}
    </>
  );
}

export default MyProjectsPage;
