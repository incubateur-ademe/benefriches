import { useForm } from "react-hook-form";
import { AgriculturalOperationActivity, getLabelForAgriculturalOperationActivity } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

const mapActivitiesToOptions = (activities: AgriculturalOperationActivity[]) =>
  activities.map((activity) => ({
    value: activity,
    label: getLabelForAgriculturalOperationActivity(activity),
  }));

export type FormValues = {
  activity: AgriculturalOperationActivity;
};

type Props = {
  initialValues?: Partial<FormValues>;
  onSubmit: (formData: FormValues) => void;
  onBack: () => void;
};

const requiredMessage =
  "Si vous ne savez pas qualifier l'activité de l'exploitation agricole, sélectionnez « Polyculture / polyélevage ».";

function AgriculturalOperationActivityForm({ initialValues, onSubmit, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ defaultValues: initialValues });

  const error = errors.activity;

  return (
    <WizardFormLayout title="De quel type d'exploitation agricole s'agit-il&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h4>Culture</h4>
          <RadioButtons
            {...register("activity", { required: requiredMessage })}
            options={mapActivitiesToOptions([
              "CEREALS_AND_OILSEEDS_CULTIVATION",
              "LARGE_VEGETABLE_CULTIVATION",
              "MARKET_GARDENING",
              "FLOWERS_AND_HORTICULTURE",
              "VITICULTURE",
              "FRUITS_AND_OTHER_PERMANENT_CROPS",
            ])}
            error={error}
          />
          <h4>Élevage</h4>
          <RadioButtons
            {...register("activity", { required: requiredMessage })}
            options={mapActivitiesToOptions([
              "CATTLE_FARMING",
              "PIG_FARMING",
              "POULTRY_FARMING",
              "SHEEP_AND_GOAT_FARMING",
            ])}
            error={error}
          />
          <h4>Autre</h4>
          <RadioButtons
            {...register("activity", { required: requiredMessage })}
            options={mapActivitiesToOptions(["POLYCULTURE_AND_LIVESTOCK"])}
            error={error}
          />
        </div>

        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default AgriculturalOperationActivityForm;
