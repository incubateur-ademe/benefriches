import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  askForReinstatementFullTimeJobs: boolean;
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  reinstatementFullTimeJobsInvolved: number;
  fullTimeJobs: number;
};

function ProjectFullTimeJobsInvolvedForm({
  askForReinstatementFullTimeJobs,
  onSubmit,
}: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <>
      <h2>
        Emplois équivalent temps plein mobilisés pour la reconversion du site
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForReinstatementFullTimeJobs && (
          <NumericInput
            control={control}
            name="reinstatementFullTimeJobsInvolved"
            label="Remise en état de la friche"
            rules={{ required: "Ce champ est requis" }}
          />
        )}
        <NumericInput
          control={control}
          name="fullTimeJobs"
          label="Installation des panneaux photovoltaïques"
          rules={{ required: "Ce champ est requis" }}
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

export default ProjectFullTimeJobsInvolvedForm;
