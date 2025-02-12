import Alert from "@codegouvfr/react-dsfr/Alert";
import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useForm } from "react-hook-form";

import TileLink from "@/shared/views/components/TileLink/TileLink";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";

import FeatureAlertModalTitle from "../FeatureAlertModalTitle";

type Props = {
  exportImpactsAlert: boolean;
  onSaveLoadingState: "idle" | "loading" | "error" | "success";
  onSubmit: (formData: FormValues) => void;
  userEmail?: string;
};

const exportImpactsFeatureAlertModal = createModal({
  id: "export-impacts-feature-alert-modal",
  isOpenedByDefault: false,
});

type Option = "pdf" | "excel" | "sharing_link";

type FormValues = {
  email: string;
  options: Option[];
};

const SUCCESS_BUTTON_PROPS: ButtonProps = {
  size: "small",
  priority: "secondary",
  disabled: true,
  children: "Vous serez notifié·e",
  iconId: "fr-icon-check-line",
  className: "!tw-bg-impacts-positive-light !tw-text-dsfr-titleBlue !tw-shadow-none",
};

const BUTTON_PROPS: ButtonProps = {
  size: "small",
  priority: "secondary",
  iconId: "ri-file-copy-line",
  children: "Me notifier",
  onClick: () => {
    exportImpactsFeatureAlertModal.open();
  },
};

function TileExportImpacts({ exportImpactsAlert, onSubmit, onSaveLoadingState, userEmail }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: { email: userEmail, options: [] },
  });

  const isSuccess = onSaveLoadingState === "success";

  return (
    <>
      <TileLink
        title="Exporter les impacts du projet"
        badgeText="Bientôt disponible"
        iconId="fr-icon-file-download-line"
        disabled
        button={exportImpactsAlert ? SUCCESS_BUTTON_PROPS : BUTTON_PROPS}
      />

      <exportImpactsFeatureAlertModal.Component
        title={
          <FeatureAlertModalTitle
            title="Exporter les impacts du projet"
            iconId="fr-icon-file-download-line"
            isSuccess={isSuccess}
          />
        }
        size={isSuccess ? "small" : "large"}
      >
        {isSuccess ? (
          <>Votre demande a bien été prise en compte&nbsp;!</>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Checkbox
              legend={
                <p>
                  Quel format d’export vous serait plus utile ? <br />
                  <span className="tw-text-sm">(plusieurs réponses possibles)</span>
                </p>
              }
              options={[
                {
                  label: "PDF avec textes et graphiques",
                  nativeInputProps: {
                    ...register("options"),
                    value: "pdf",
                  },
                },
                {
                  label: "Tableur Excel éditable",
                  nativeInputProps: {
                    ...register("options"),
                    value: "excel",
                  },
                },
                {
                  label: "Lien à partager",
                  nativeInputProps: {
                    ...register("options"),
                    value: "sharing_link",
                  },
                },
              ]}
              state={formState.errors.options ? "error" : "default"}
              stateRelatedMessage={
                formState.errors.options ? formState.errors.options.message : undefined
              }
            />
            <p>Recevez un mail lorsque cette fonctionnalité sera disponible :</p>
            <Input
              label={<RequiredLabel label="Votre adresse mail" />}
              state={formState.errors.email ? "error" : "default"}
              stateRelatedMessage={
                formState.errors.email ? formState.errors.email.message : undefined
              }
              nativeInputProps={{
                placeholder: "utilisateur@ademe.fr",
                ...register("email", {
                  required: "Vous devez renseigner votre e-mail pour continuer.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Veuillez entrer une adresse email valide.",
                  },
                }),
              }}
            />
            {onSaveLoadingState === "error" && (
              <Alert
                description="Une erreur s'est produite lors de la sauvegarde des données... Veuillez réessayer."
                severity="error"
                title="Échec de l'enregistrement"
                className="tw-my-7"
              />
            )}
            <div className="tw-flex tw-justify-end">
              <Button
                type="submit"
                disabled={onSaveLoadingState === "loading" || !formState.isValid}
                iconId="fr-icon-notification-3-line"
              >
                {onSaveLoadingState === "loading" ? "Chargement..." : "Me notifier"}
              </Button>
            </div>
          </form>
        )}
      </exportImpactsFeatureAlertModal.Component>
    </>
  );
}

export default TileExportImpacts;
