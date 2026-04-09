import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  isFriche: "yes" | "no";
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function IsFricheForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
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
    <WizardFormLayout title="Votre site est-il une friche&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isFriche", { required: requiredMessage })}
          options={options}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default IsFricheForm;
