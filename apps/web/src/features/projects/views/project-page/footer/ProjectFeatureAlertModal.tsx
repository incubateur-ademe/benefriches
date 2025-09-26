import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";

import Badge from "@/shared/views/components/Badge/Badge";
import Dialog from "@/shared/views/components/Dialog/A11yDialog";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";

type Props = {
  hasProjectAlert: boolean;
  onSaveLoadingState: "idle" | "loading" | "error" | "success";
  onSubmit: (formData: FormValues) => void;
  userEmail?: string;
  title: string;
  dialogId: string;
};

type FormValues = {
  email: string;
};

function ProjectFeatureAlertModal({
  onSubmit,
  onSaveLoadingState,
  userEmail,
  title,
  dialogId,
  hasProjectAlert,
}: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: { email: userEmail },
  });

  return (
    <Dialog
      title={
        <div className="text-dsfr-title-blue">
          <i className="fr-icon--xl pr-2 ri-file-copy-line"></i>
          {title}
          <Badge small style="green-tilleul" className="ml-2">
            Bientôt disponible
          </Badge>
        </div>
      }
      dialogId={dialogId}
      size={hasProjectAlert ? "small" : "medium"}
    >
      {hasProjectAlert ? (
        <Alert
          severity="success"
          title="Votre demande a bien été prise en compte"
          description="Vous serez notifié·e par e-mail lorsque la fonctionnalité sera disponible !"
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
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
    </Dialog>
  );
}

export default ProjectFeatureAlertModal;
