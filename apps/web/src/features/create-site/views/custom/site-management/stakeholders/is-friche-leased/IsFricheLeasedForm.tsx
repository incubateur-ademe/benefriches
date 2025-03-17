import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  isFricheLeased: "yes" | "no" | null;
};

function IsFricheLeasedForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout
      title="La friche est-elle encore louée ?"
      instructions={
        <>
          <p>
            Tout ou partie du site peut encore être occupé (maintien d'une des activités du site,
            usage transitoire, occupation temporaire...).
          </p>
          <p>
            Bénéfriches a besoin de cette information pour savoir à qui imputer les différentes
            dépenses de la friche.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isFricheLeased")}
          options={[
            {
              label: `Oui`,
              value: "yes",
            },
            {
              label: "Non / Ne sait pas",
              value: "no",
            },
          ]}
          error={formState.errors.isFricheLeased}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("isFricheLeased") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default IsFricheLeasedForm;
