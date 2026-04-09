import { useForm } from "react-hook-form";

import { PhotovoltaicKeyParameter } from "@/features/create-project/core/project.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function KeyParameterForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const error = formState.errors.photovoltaicKeyParameter;

  const options = [
    {
      label: "La puissance de l'installation",
      value: "POWER",
    },
    {
      label: "La superficie de l'installation",
      value: "SURFACE",
    },
  ];

  return (
    <WizardFormLayout title="Quel est le paramètre déterminant pour la centrale photovoltaïque ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("photovoltaicKeyParameter", {
            required: requiredMessage,
          })}
          options={options}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default KeyParameterForm;
