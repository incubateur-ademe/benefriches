import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  fullTimeJobs: number;
};

function OperationsFullTimeJobsInvolvedForm({ onSubmit }: Props) {
  const { handleSubmit, control } = useForm<FormValues>();

  return (
    <>
      <h2>
        Emplois équivalent temps plein mobilisés pour l’exploitation du site
        reconverti
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          name="fullTimeJobs"
          label="Maintenance des panneaux photovoltaïques"
          rules={{
            required: "Ce champ est requis",
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
    </>
  );
}

export default OperationsFullTimeJobsInvolvedForm;
