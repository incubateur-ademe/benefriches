import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  decontaminationSelection: "partial" | "none" | "unknown" | null;
};

function SoilsDecontaminationSelection({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="Est-il est nécessaire de dépolluer les sols&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("decontaminationSelection")}
          options={[
            {
              label: "Oui",
              value: "partial",
            },
            {
              label: "Non",
              value: "none",
            },
            {
              label: "Ne sait pas",
              value: "unknown",
              hintText: "Bénéfriches appliquera un ratio de 25% aux sols pollués.",
            },
          ]}
          error={formState.errors.decontaminationSelection}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("decontaminationSelection") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSelection;
