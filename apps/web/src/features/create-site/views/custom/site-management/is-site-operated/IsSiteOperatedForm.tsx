import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  isSiteOperated: "yes" | "no" | null;
};

function IsSiteOperatedForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Le site est-il exploité ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isSiteOperated")}
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
          error={formState.errors.isSiteOperated}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("isSiteOperated") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default IsSiteOperatedForm;
