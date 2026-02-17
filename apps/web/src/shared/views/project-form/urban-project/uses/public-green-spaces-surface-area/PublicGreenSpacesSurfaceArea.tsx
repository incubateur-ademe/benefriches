import { useForm } from "react-hook-form";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValue: number | undefined;
  siteSurfaceArea: number;
  onSubmit: (surfaceArea: number) => void;
  onBack: () => void;
};

type FormValues = {
  surfaceArea: number;
};

function PublicGreenSpacesSurfaceArea({ initialValue, siteSurfaceArea, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { surfaceArea: initialValue },
  });

  return (
    <WizardFormLayout
      title="Quelle superficie feront les espaces verts publics&nbsp;?"
      instructions={
        <FormInfo>
          La surface totale du site est de <strong>{formatSurfaceArea(siteSurfaceArea)}</strong>.
        </FormInfo>
      }
    >
      <form
        onSubmit={handleSubmit(({ surfaceArea }) => {
          onSubmit(surfaceArea);
        })}
      >
        <RowDecimalsNumericInput
          addonText={SQUARE_METERS_HTML_SYMBOL}
          label="Superficie des espaces verts publics"
          nativeInputProps={register("surfaceArea", {
            ...requiredNumericFieldRegisterOptions,
            max: {
              value: siteSurfaceArea,
              message: `La superficie ne peut pas dépasser celle du site (${formatSurfaceArea(siteSurfaceArea)})`,
            },
          })}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PublicGreenSpacesSurfaceArea;
