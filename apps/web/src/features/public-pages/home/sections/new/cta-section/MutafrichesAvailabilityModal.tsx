import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";

import FeatureAlertModalTitle from "@/features/projects/views/project-page/footer/FeatureAlertModalTitle";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";

import { mutafrichesAvailabilityModal } from "./mutafrichesModal";

type Props = {
  onSaveLoadingState: "idle" | "loading" | "error" | "success";
  onSubmit: (email: string) => void;
  userEmail?: string;
};

type FormValues = {
  email: string;
};

function MutafrichesAvailabilityModal({ onSubmit, onSaveLoadingState, userEmail }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: { email: userEmail },
  });
  const isSuccess = onSaveLoadingState === "success";

  return (
    <mutafrichesAvailabilityModal.Component
      title={
        <FeatureAlertModalTitle
          title="Analyser la compatibilité de ma friche"
          iconId="ri-file-copy-line"
        />
      }
      size={isSuccess ? "small" : "large"}
    >
      {isSuccess ? (
        <>Votre demande a bien été prise en compte&nbsp;!</>
      ) : (
        <form
          onSubmit={handleSubmit((formData) => {
            onSubmit(formData.email);
          })}
        >
          <p>Recevez un mail lorsque cette fonctionnalité sera disponible :</p>
          <Input
            label={<RequiredLabel label="Votre adresse mail" />}
            state={formState.errors.email ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.email ? formState.errors.email.message : undefined
            }
            nativeInputProps={{
              placeholder: "exemple@mail.fr",
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
              className="my-7"
            />
          )}
          <div className="flex justify-end">
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
    </mutafrichesAvailabilityModal.Component>
  );
}

export default MutafrichesAvailabilityModal;
