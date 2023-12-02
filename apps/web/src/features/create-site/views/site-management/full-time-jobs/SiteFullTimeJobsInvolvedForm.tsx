import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  fullTimeJobsInvolved?: number;
};

function SiteFullTimeJobsInvolvedForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Combien d'emplois équivalent temps-plein sont mobilisés sur le site ?">
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
    </WizardFormLayout>
  );
}

export default SiteFullTimeJobsInvolvedForm;
