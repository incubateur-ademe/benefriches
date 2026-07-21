import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  developerWillBeBuildingsConstructor: "yes" | "no";
};

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function StakeholdersBuildingsDeveloper({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="L'aménageur sera-t-il le constructeur des nouveaux bâtiments ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("developerWillBeBuildingsConstructor", { required: true })}
          options={[
            {
              label: "Oui",
              value: "yes",
            },
            {
              label: "Non",
              value: "no",
            },
          ]}
          error={formState.errors.developerWillBeBuildingsConstructor}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default StakeholdersBuildingsDeveloper;
