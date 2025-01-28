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
  buildingsResalePlanned: "yes" | "no" | null;
};

function BuildingsResaleForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="Une fois contruits ou réhabilités, les bâtiments seront-ils revendus ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("buildingsResalePlanned", { required: true })}
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
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsResaleForm;
