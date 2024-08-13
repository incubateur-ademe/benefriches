import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  fullTimeJobsInvolved?: number;
};

function SiteFullTimeJobsInvolvedForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <WizardFormLayout
      title="Combien d'emplois équivalent temps-plein sont mobilisés sur le site ?"
      instructions={
        <FormDefinition hideDivider>
          <p>
            Il s'agit des emplois liés au gardiennage, à l'entretien de bâtiments (ex : maintien
            hors gel) ou des accès (ex : portail, clôture) voire à la réparation de dégradation
            volontaire ou de vandalisme.
          </p>
        </FormDefinition>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="fullTimeJobsInvolved"
          label="Emplois temps plein"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un nombre valide",
            },
          }}
          control={control}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteFullTimeJobsInvolvedForm;
