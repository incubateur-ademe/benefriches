import Alert from "@codegouvfr/react-dsfr/Alert";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

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
        <WizardFormLayout title={`✅ Le site « ${siteName} » est créé !`}>
          <p>
            Vous pouvez maintenant découvrir ses caractéristiques géographiques, créer un projet sur
            ce site ou bien renseigner un nouveau site en retournant sur votre tableau de bord.
          </p>
          <ButtonsGroup
            buttons={[
              {
                priority: "secondary",
                children: "Retour à mes projets",
                linkProps: routes.myProjects().link,
              },
              {
                priority: "primary",
                children: "Créer un projet sur ce site",
                linkProps: routes.createProjectIntro({ siteId }).link,
              },
            ]}
            inlineLayoutWhen="always"
          />
        </WizardFormLayout>
      );
  }
}

export default SiteCreationConfirmation;
