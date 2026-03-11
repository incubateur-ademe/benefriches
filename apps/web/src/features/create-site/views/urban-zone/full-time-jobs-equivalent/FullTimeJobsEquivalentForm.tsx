import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  fullTimeJobs: number;
};

type Props = {
  initialValue?: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function FullTimeJobsEquivalentForm({ initialValue, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      fullTimeJobs: initialValue,
    },
  });

  return (
    <WizardFormLayout title="Combien y a t-il d'emplois équivalents temps plein dans la zone d'activité commerciale ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          label="Nombre d'emplois (ETP)"
          nativeInputProps={register("fullTimeJobs", {
            required: "Ce champ est requis.",
            min: { value: 0, message: "La valeur doit être supérieure ou égale à 0." },
            valueAsNumber: true,
          })}
          state={formState.errors.fullTimeJobs ? "error" : "default"}
          stateRelatedMessage={formState.errors.fullTimeJobs?.message}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default FullTimeJobsEquivalentForm;
