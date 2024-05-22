import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  isSiteWorked: "yes" | "no";
};

const requiredMessage = "Ce champ est requis";

function IsSiteWorkedForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Le site est-il exploité ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isSiteWorked", { required: requiredMessage })}
          options={[
            {
              label: `Oui`,
              value: "yes",
            },
            {
              label: "Non / Ne sait pas",
              value: "no",
            },
          ]}
          error={formState.errors.isSiteWorked}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default IsSiteWorkedForm;
