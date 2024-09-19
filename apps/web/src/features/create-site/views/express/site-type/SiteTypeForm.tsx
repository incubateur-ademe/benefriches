import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  isFriche: "yes" | "no";
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function SiteTypeForm({ onSubmit, onBack }: Props) {
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
      <WizardFormLayout
        title="Votre site est-il une friche ?"
        instructions={
          <FormDefinition hideDivider>
            <p>
              Une friche est un terrain, bâti ou non bâti, inutilisé et dont l'état, la
              configuration ou l'occupation totale ou partielle ne permet pas un réemploi sans un
              aménagement ou des travaux préalables.
            </p>
            <p>
              Une friche peut être industrielle, militaire, ferroviaire, portuaire... mais aussi
              agricole, hospitalière, administrative, commerciale ou d'habitat.
            </p>
          </FormDefinition>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <RadioButtons
            {...register("isFriche", { required: requiredMessage })}
            options={options}
            error={error}
          />
          <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
        </form>
      </WizardFormLayout>
    </>
  );
}

export default SiteTypeForm;
