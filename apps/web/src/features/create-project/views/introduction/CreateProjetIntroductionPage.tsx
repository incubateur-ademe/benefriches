import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteId: string;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({ siteId, siteName, siteLoadingState }: Props) {
  switch (siteLoadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner />;
    case "error":
      return (
        <WizardFormLayout title="Le site demandé n'a pas pu ếtre chargé">
          <p>
            Une erreur est survenue lors du chargement des informations du site, veuillez réessayer.
          </p>
        </WizardFormLayout>
      );
    case "success":
      return (
        <section className="tw-py-7 lg:tw-px-[200px]">
          <div className="tw-text-[80px] tw-mb-10 tw-leading-none">🏗</div>
          <h2 className="tw-mb-10">Vous avez un projet d'aménagement sur le site "{siteName}".</h2>
          <p className="tw-text-xl tw-mb-10">
            Nous allons ici parler de votre <strong>projet d'aménagement</strong> : la nature du
            projet, la transformation des sols du site, les acteurs associés, les coûts et recettes
            prévisionnels, le calendrier des travaux, etc.
          </p>
          <Button size="large" linkProps={routes.createProject({ siteId }).link}>
            Commencer
          </Button>
        </section>
      );
  }
}

export default CreateProjectIntroductionPage;
