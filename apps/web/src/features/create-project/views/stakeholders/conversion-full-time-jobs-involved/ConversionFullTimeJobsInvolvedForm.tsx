import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  askForReinstatementFullTimeJobs: boolean;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementFullTimeJobs?: number;
  fullTimeJobs?: number;
};

function ConversionFullTimeJobsInvolvedForm({
  askForReinstatementFullTimeJobs,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout title="Emplois équivalent temps plein mobilisés pour la reconversion du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementFullTimeJobs && (
          <NumericInput
            control={control}
            name="reinstatementFullTimeJobs"
            label="Remise en état de la friche"
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner un montant valide",
              },
            }}
          />
        )}
        <NumericInput
          control={control}
          name="fullTimeJobs"
          label="Installation des panneaux photovoltaïques"
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

export default ConversionFullTimeJobsInvolvedForm;
