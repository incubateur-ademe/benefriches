import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  developerWillBeBuildingsConstructor: "yes" | "no" | null;
  buildingsResalePlanned?: "yes" | "no" | null;
};

// react-hook-form reads an unchecked radio group as null, and an unregistered field as undefined.
const isAnswered = (value: "yes" | "no" | null | undefined) =>
  value !== null && value !== undefined;

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function StakeholdersBuildingsDeveloper({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const developerWillBeBuildingsConstructor = watch("developerWillBeBuildingsConstructor");
  const buildingsResalePlanned = watch("buildingsResalePlanned");
  const isResaleQuestionDisplayed = developerWillBeBuildingsConstructor === "yes";
  // Derived from the watched values rather than formState.isValid: the resale question unmounts
  // when switching to Non, and isValid is not recomputed on unmount.
  const isComplete =
    isAnswered(developerWillBeBuildingsConstructor) &&
    (!isResaleQuestionDisplayed || isAnswered(buildingsResalePlanned));

  return (
    <WizardFormLayout title="L'aménageur construira-t-il ou réhabilitera-t-il tout ou partie des bâtiments ?">
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
        {isResaleQuestionDisplayed && (
          <RadioButtons
            {...register("buildingsResalePlanned", { required: true })}
            legend="Une fois construits ou réhabilités, les bâtiments seront-ils revendus ?"
            options={[
              {
                label: "Oui, les bâtiments seront revendus",
                value: "yes",
              },
              {
                label: "Non, les bâtiments resteront exclusivement la propriété de l'aménageur",
                value: "no",
              },
            ]}
            error={formState.errors.buildingsResalePlanned}
          />
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!isComplete} />
      </form>
    </WizardFormLayout>
  );
}

export default StakeholdersBuildingsDeveloper;
