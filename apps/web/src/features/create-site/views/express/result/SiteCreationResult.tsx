import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import { routes } from "@/shared/views/router";

import SiteFeaturesModalView from "./SiteFeaturesContainer";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  onBack: () => void;
};

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
            className="my-7"
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
          <div
            className={classNames(
              "border-border-grey",
              "border-solid",
              "border",
              "shadow-md",
              "rounded-lg",
              "p-4",
              "mb-8",
            )}
          >
            💡 Bénéfriches a affecté des données par défaut, notamment pour la répartition des sols
            et les dépenses de gestion.
          </div>

          <SiteFeaturesModalView siteId={siteId} />
          <EditorialPageButtonsSection>
            <Button size="large" linkProps={routes.createProject({ siteId }).link}>
              Renseigner mon projet sur ce site
            </Button>
          </EditorialPageButtonsSection>
          <p className="text-sm mt-5">
            Attention, le site ayant été créé en mode "express", c'est-à-dire avec des données
            moyennes, les impacts du projet que vous allez renseigner peuvent ne pas refléter la
            réalité.
          </p>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationResult;
