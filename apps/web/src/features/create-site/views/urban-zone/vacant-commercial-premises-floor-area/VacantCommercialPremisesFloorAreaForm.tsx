import { useForm } from "react-hook-form";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  surfaceArea: number;
};

type Props = {
  initialValue?: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function VacantCommercialPremisesFloorAreaForm({ initialValue, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      surfaceArea: initialValue,
    },
  });

  return (
    <WizardFormLayout title="Quelle est la surface de plancher des locaux commerciaux vacants ou en friche ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          label="Surface de plancher"
          addonText={SQUARE_METERS_HTML_SYMBOL}
          nativeInputProps={register("surfaceArea", {
            required: "Ce champ est requis.",
            min: { value: 0, message: "La surface doit être supérieure ou égale à 0." },
            valueAsNumber: true,
          })}
          state={formState.errors.surfaceArea ? "error" : "default"}
          stateRelatedMessage={formState.errors.surfaceArea?.message}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default VacantCommercialPremisesFloorAreaForm;
