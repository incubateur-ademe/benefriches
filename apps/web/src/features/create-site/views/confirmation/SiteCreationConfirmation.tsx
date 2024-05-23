import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

function SiteCreationConfirmation({ siteId, siteName, loadingState }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return (
        <LoadingSpinner loadingText={`Création du site « ${siteName} », veuillez patienter...`} />
      );
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du site">
          <Alert
            description={`Une erreur est survenue lors de la création du site « ${siteName} », veuillez réessayer.`}
            severity="error"
            title="Le site n'a pas pu être enregistré"
            className="fr-my-7v"
          />
        </WizardFormLayout>
      );
    case "success":
      return (
        <section className="tw-py-7 lg:tw-px-[200px]">
          <div className="tw-text-[80px] tw-mb-10 tw-leading-none">✅</div>
          <h2 className="tw-mb-10">Le site « {siteName} » est créé !</h2>
          <p className="tw-text-xl tw-mb-10">
            Vous pouvez maintenant renseigner un projet sur ce site avant de pouvoir calculer les
            impacts qui lui sont associés.
          </p>
          <Button size="large" linkProps={routes.createProjectIntro({ siteId }).link}>
            Renseigner mon projet sur ce site
          </Button>
        </section>
      );
  }
}

export default SiteCreationConfirmation;
