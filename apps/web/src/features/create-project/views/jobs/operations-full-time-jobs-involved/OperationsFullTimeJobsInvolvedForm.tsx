import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  defaultValue?: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  fullTimeJobs?: number;
};

function OperationsFullTimeJobsInvolvedForm({ defaultValue, onSubmit, onBack }: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      fullTimeJobs: defaultValue,
    },
  });

  return (
    <WizardFormLayout
      title="Emplois équivalent temps plein mobilisés pour l'exploitation du site
    reconverti"
      instructions={
        <>
          <p>
            Nombre d’emplois calculé d’après les dépenses que vous avez renseignées à l’étape
            précédente et le nombre d’emplois par € de chiffre d’affaires du secteur d’activités du
            photovoltaïque en France.
          </p>
          <p>Vous pouvez modifier cette valeur.</p>
        </>
      }
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
