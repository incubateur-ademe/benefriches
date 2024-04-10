import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  isFriche: "yes" | "no";
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function SiteTypeForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const error = formState.errors.isFriche;

  const options = [
    {
      label: "Oui",
      value: "yes",
    },
    {
      label: "Non",
      value: "no",
    },
  ];

  return (
    <>
      <AboutFormsModal />
      <WizardFormLayout
        title="Votre site est-il une friche ?"
        instructions={
          <>
            <p>
              Une friche est un terrain, bâti ou non bâti, inutilisé et dont l'état, la
              configuration ou l'occupation totale ou partielle ne permet pas un réemploi sans un
              aménagement ou des travaux préalables.
            </p>
            <p>
              Une friche peut être industrielle, militaire, ferroviaire, portuaire... mais aussi
              agricole, hospitalière, administrative, commerciale ou d'habitat.
            </p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <RadioButtons
            {...register("isFriche", { required: requiredMessage })}
            options={options}
            error={error}
          />
          <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
        </form>
      </WizardFormLayout>
    </>
  );
}

export default SiteTypeForm;
