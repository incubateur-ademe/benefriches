import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  fullTimeJobs?: number;
};

function OperationsFullTimeJobsInvolvedForm({ onSubmit, onBack }: Props) {
  const { handleSubmit, control } = useForm<FormValues>();

  return (
    <WizardFormLayout
      title="Emplois équivalent temps plein mobilisés pour l'exploitation du site
    reconverti"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          name="fullTimeJobs"
          label="Maintenance des panneaux photovoltaïques"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default OperationsFullTimeJobsInvolvedForm;
