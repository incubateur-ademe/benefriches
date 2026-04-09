import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import {
  AgriculturalOperationActivity,
  FricheActivity,
  getFricheActivityShortLabel,
  getLabelForNaturalAreaType,
  getShortLabelForAgriculturalOperationActivity,
  NaturalAreaType,
} from "shared";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteFeaturesModalView from "./SiteFeaturesContainer";

type Props = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  onErrorBack: () => void;
  siteAddress: {
    postCode?: string;
    cityName?: string;
  };
  siteActivity?:
    | {
        type: "AGRICULTURAL_OPERATION";
        agriculturalOperationActivity: AgriculturalOperationActivity;
      }
    | {
        type: "NATURAL_AREA";
        naturalAreaType: NaturalAreaType;
      }
    | {
        type: "FRICHE";
        fricheActivity: FricheActivity;
      };
};

const getSiteActivityDisclaimerText = (siteActivity: Props["siteActivity"]) => {
  switch (siteActivity?.type) {
    case "AGRICULTURAL_OPERATION":
      return `ce type d'exploitation agricole (${getShortLabelForAgriculturalOperationActivity(siteActivity.agriculturalOperationActivity).toLocaleLowerCase()})`;
    case "NATURAL_AREA":
      return `ce type d'espace naturel (${getLabelForNaturalAreaType(siteActivity.naturalAreaType).toLocaleLowerCase()})`;
    case "FRICHE":
      return `ce type de friche (${getFricheActivityShortLabel(siteActivity.fricheActivity).toLocaleLowerCase()})`;
    default:
      return "ce type de site";
  }
};

function SiteCreationResult({
  siteId,
  siteName,
  loadingState,
  onErrorBack,
  siteActivity,
  siteAddress,
}: Props) {
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
          <Button onClick={onErrorBack} priority="secondary">
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
            💡 Bénéfriches a affecté des données par défaut, en se basant sur les moyennes observées
            sur {getSiteActivityDisclaimerText(siteActivity)} dans cette zone géographique (
            {siteAddress.postCode}&nbsp;{siteAddress.cityName})
          </div>

          <SiteFeaturesModalView siteId={siteId} />
          <EditorialPageButtonsSection>
            <ButtonsGroup
              inlineLayoutWhen="always"
              alignment="between"
              buttons={[
                {
                  linkProps: routes.myEvaluations().link,
                  priority: "secondary",
                  children: "Retour à mes évaluations",
                },
                {
                  linkProps: routes.createProject({ siteId }).link,
                  children: "Évaluer un projet démo sur ce site",
                },
              ]}
            />
          </EditorialPageButtonsSection>
        </EditorialPageLayout>
      );
  }
}

export default SiteCreationResult;
