import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  involvesReinstatement: "yes" | "no" | null;
};

function InvolvesReinstatementForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title={<>Le projet prévoit-il une remise en état du site&nbsp;?</>}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("involvesReinstatement", { required: true })}
          options={[
            {
              label: "Oui, le projet inclut des travaux de remise en état",
              value: "yes",
            },
            {
              label: "Non, le projet ne prévoit pas de remise en état",
              value: "no",
            },
          ]}
          error={formState.errors.involvesReinstatement}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default InvolvesReinstatementForm;
