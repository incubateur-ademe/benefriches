import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  askForReinstatementFullTimeJobs: boolean;
  defaultValues: {
    fullTimeJobs?: number;
    reinstatementFullTimeJobs?: number;
  };
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementFullTimeJobs?: number;
  fullTimeJobs?: number;
};

function ConversionFullTimeJobsInvolvedForm({
  askForReinstatementFullTimeJobs,
  defaultValues,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      fullTimeJobs: defaultValues.fullTimeJobs,
      reinstatementFullTimeJobs: defaultValues.reinstatementFullTimeJobs,
    },
  });

  return (
    <WizardFormLayout
      title="Emplois équivalent temps plein mobilisés pour la reconversion du site"
      instructions={
        <>
          <p>
            Nombre d’emplois calculé d’après les dépenses que vous avez renseignées à l’étape
            précédente et le nombre d’emplois par € de chiffre d’affaires des secteurs d’activités
            concernés (ex : dépollution, déconstruction, gestion de déchets, photovoltaïque) en
            France.
          </p>
          <p>Vous pouvez modifier ces valeurs.</p>
        </>
      }
    >
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
