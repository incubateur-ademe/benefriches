import { useForm } from "react-hook-form";

import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (surfaceArea: number) => void;
  onBack: () => void;
  contaminatedSoilSurface: number;
};

type FormValues = {
  percentSurfaceArea: number;
};

function SoilsDecontaminationSurfaceArea({ onSubmit, onBack, contaminatedSoilSurface }: Props) {
  const { handleSubmit, register, formState, watch } = useForm<FormValues>();

  const percentSurfaceArea = watch("percentSurfaceArea");
  const surfaceArea = (percentSurfaceArea * contaminatedSoilSurface) / 100;

  return (
    <WizardFormLayout title="Quelle part des sols pollués sera dépolluée ?">
      <form
        onSubmit={handleSubmit(() => {
          onSubmit(surfaceArea);
        })}
      >
        <RowDecimalsNumericInput
          addonText="%"
          hintText={`Surface contaminée : ${formatSurfaceArea(contaminatedSoilSurface)}`}
          hintInputText={
            !isNaN(surfaceArea) && (
              <p>
                💡 Soit <strong>{formatSurfaceArea(surfaceArea)}</strong>
              </p>
            )
          }
          label={<RequiredLabel label="Part à dépolluer" />}
          nativeInputProps={register("percentSurfaceArea", {
            ...requiredNumericFieldRegisterOptions,
            max: {
              value: 100,
              message:
                "La superficie dépolluée ne peut être supérieure à la superficie polluée du site.",
            },
          })}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSurfaceArea;
