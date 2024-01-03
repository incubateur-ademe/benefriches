import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  askForReinstatementFullTimeJobs: boolean;
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  reinstatementFullTimeJobsInvolved?: number;
  fullTimeJobs?: number;
};

function ConversionFullTimeJobsInvolvedForm({ askForReinstatementFullTimeJobs, onSubmit }: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout title="Emplois équivalent temps plein mobilisés pour la reconversion du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementFullTimeJobs && (
          <NumericInput
            control={control}
            name="reinstatementFullTimeJobsInvolved"
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
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default ConversionFullTimeJobsInvolvedForm;
