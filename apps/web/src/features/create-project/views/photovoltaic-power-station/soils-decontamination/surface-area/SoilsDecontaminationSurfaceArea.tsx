import { useForm } from "react-hook-form";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  contaminatedSoilSurface: number;
};

export type FormValues = {
  surfaceArea: number;
};

function SoilsDecontaminationSurfaceArea({ onSubmit, onBack, contaminatedSoilSurface }: Props) {
  const { handleSubmit, control, formState } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Quelle part des sols pollués sera dépolluée ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          addonText={SQUARE_METERS_HTML_SYMBOL}
          hintText={`Surface contaminée : ${formatSurfaceArea(contaminatedSoilSurface)}`}
          label={<RequiredLabel label="Superficie à dépolluer" />}
          name="surfaceArea"
          rules={{
            required: "Ce champ est requis",
            min: {
              value: 0,
              message: "Veuillez sélectionner une surface valide.",
            },
            max: {
              value: contaminatedSoilSurface,
              message:
                "La superficie dépolluée ne peut être supérieure à la superficie polluée du site.",
            },
          }}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSurfaceArea;
