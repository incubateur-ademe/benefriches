import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { routes } from "@/app/views/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteFeaturesModalView from "./SiteFeaturesModalView";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  onBack: () => void;
};

const siteFeaturesModal = createModal({
  id: "site-features-modal",
  isOpenedByDefault: false,
});

function SiteCreationResult({ siteId, siteName, loadingState, onBack }: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner loadingText="Création du site, veuillez patienter..." />;
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du site">
          <Alert
            description={`Une erreur est survenue lors de la création du site, veuillez réessayer.`}
            severity="error"
            title="Le site n'a pas pu être enregistré"
            className="tw-my-7"
          />
          <Button onClick={onBack} priority="secondary">
            Précédent
          </Button>
        </WizardFormLayout>
      );
    case "success":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>✅</EditorialPageIcon>
          <EditorialPageTitle>Le site « {siteName} » est créé !</EditorialPageTitle>
          <EditorialPageText>
            Bénéfriches a affecté des données par défaut, notamment pour la répartition des sols et
            les dépenses de gestion.
            <br />
            <a
              onClick={() => {
                siteFeaturesModal.open();
              }}
              role="button"
              href="#"
            >
              Consulter les données du site utilisées par Bénéfriches
            </a>
            <siteFeaturesModal.Component title="Caractéristiques du site" size="large">
              <SiteFeaturesModalView siteId={siteId} />
            </siteFeaturesModal.Component>
          </EditorialPageText>
          <EditorialPageText>
            Vous pouvez maintenant renseigner un projet sur ce site, en mode express ou en mode
            personnalisé.
          </EditorialPageText>
          <Button size="large" linkProps={routes.createProject({ siteId }).link}>
            Renseigner mon projet sur ce site
          </Button>
          <p className="tw-text-sm tw-mt-5">
            Attention, le site ayant été créé en mode "express", c'est-à-dire avec des données
            moyennes, les impacts du projet que vous allez renseigner peuvent ne pas refléter la
            réalité.
          </p>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationResult;
