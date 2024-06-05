import { Controller, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
        <FormInfo>
          <p>
            Nombre d’emplois calculé d’après les dépenses que vous avez renseignées à l’étape
            précédente et le nombre d’emplois par € de chiffre d’affaires du secteur d’activités du
            photovoltaïque en France.
          </p>
          <p>Vous pouvez modifier cette valeur.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="fullTimeJobs"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Maintenance des panneaux photovoltaïques"
                className="!tw-pt-4 !tw-mb-8"
              />
            );
          }}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default OperationsFullTimeJobsInvolvedForm;
