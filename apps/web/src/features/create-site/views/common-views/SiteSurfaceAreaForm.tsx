import { useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  surfaceArea: number;
};

function SiteSurfaceAreaForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({ defaultValues: initialValues });

  const surface = watch("surfaceArea");

  return (
    <WizardFormLayout
      title="Quelle est la superficie totale du site ?"
      instructions={
        <FormInfo>
          <p>Superficie à renseigner en m².</p>
          <p>Pour rappel : 1 ha = 10 000 m²</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          addonText={SQUARE_METERS_HTML_SYMBOL}
          label={<RequiredLabel label="Superficie totale" />}
          nativeInputProps={register("surfaceArea", requiredNumericFieldRegisterOptions)}
        />

        {!isNaN(surface) && (
          <p>
            💡 Soit <strong>{formatNumberFr(convertSquareMetersToHectares(surface))}</strong> ha.
          </p>
        )}

        <BackNextButtonsGroup onBack={onBack} disabled={!surface} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSurfaceAreaForm;
