import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  fullTimeJobsInvolved: number;
};

function SiteFullTimeJobsInvolvedForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <>
      <h2>
        Combien d'emplois équivalent temps-plein sont mobilisés sur le site ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="fullTimeJobsInvolved"
          label="Emplois temps plein"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          control={control}
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

export default SiteFullTimeJobsInvolvedForm;
