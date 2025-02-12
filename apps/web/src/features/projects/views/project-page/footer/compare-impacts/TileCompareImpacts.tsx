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
  compareImpactsAlert: boolean;
  onSaveLoadingState: "idle" | "loading" | "error" | "success";
  onSubmit: (formData: FormValues) => void;
  userEmail?: string;
};

const compareImpactsFeatureAlertModal = createModal({
  id: "compare-impacts-feature-alert-modal",
  isOpenedByDefault: false,
});

type Option = "same_project_on_other_site" | "other_project_on_same_site" | "statu_quo_scenario";

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
  iconId: "fr-icon-notification-3-line",
  children: "Me notifier",
  onClick: () => {
    compareImpactsFeatureAlertModal.open();
  },
};

function TileCompareImpacts({
  compareImpactsAlert,
  onSubmit,
  onSaveLoadingState,
  userEmail,
}: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: { email: userEmail, options: [] },
  });

  const isSuccess = onSaveLoadingState === "success";

  return (
    <>
      <TileLink
        title="Comparer les impacts avec un autre projet"
        badgeText="Bientôt disponible"
        iconId="fr-icon-scales-3-line"
        disabled
        button={compareImpactsAlert ? SUCCESS_BUTTON_PROPS : BUTTON_PROPS}
      />

      <compareImpactsFeatureAlertModal.Component
        title={
          <FeatureAlertModalTitle
            title="Comparer les impacts avec un autre projet"
            iconId="fr-icon-scales-3-line"
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
                  À quoi trouveriez-vous utile de comparer les impacts de ce projet ?
                  <br />
                  <span className="tw-text-sm">(plusieurs réponses possibles)</span>
                </p>
              }
              options={[
                {
                  label: "À un projet similaire sur un autre site",
                  nativeInputProps: {
                    ...register("options"),
                    value: "same_project_on_other_site",
                  },
                },
                {
                  label: "À un autre projet sur le même site",
                  nativeInputProps: {
                    ...register("options"),
                    value: "other_project_on_same_site",
                  },
                },
                {
                  label: "Au scénario de statu quo sur ce site",
                  nativeInputProps: {
                    ...register("options"),
                    value: "statu_quo_scenario",
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
      </compareImpactsFeatureAlertModal.Component>
    </>
  );
}

export default TileCompareImpacts;
