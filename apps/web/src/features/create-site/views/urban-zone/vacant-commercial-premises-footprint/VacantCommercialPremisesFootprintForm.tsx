import { useForm } from "react-hook-form";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  surfaceArea: number;
};

type Props = {
  initialValue?: number;
  siteSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function VacantCommercialPremisesFootprintForm({
  initialValue,
  siteSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      surfaceArea: initialValue,
    },
    mode: "onBlur",
  });

  return (
    <WizardFormLayout
      title="Quelle est l'emprise foncière des locaux commerciaux vacants ou en friche ?"
      instructions={
        <FormInfo>
          <p>
            Superficie totale du site&nbsp;: <strong>{formatSurfaceArea(siteSurfaceArea)}</strong>.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          label="Emprise foncière"
          addonText={SQUARE_METERS_HTML_SYMBOL}
          nativeInputProps={register("surfaceArea", {
            required: "Ce champ est requis.",
            min: { value: 0, message: "La surface doit être supérieure ou égale à 0." },
            ...(siteSurfaceArea !== undefined && {
              max: {
                value: siteSurfaceArea,
                message: "La surface ne peut pas être supérieure à la superficie totale du site.",
              },
            }),
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

export default VacantCommercialPremisesFootprintForm;
