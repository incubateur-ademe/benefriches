import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  surfaceArea: number;
};

type HasContaminatedSoilsString = "yes" | "no";

export type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface?: number;
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function SoilContaminationForm({ onSubmit, surfaceArea }: Props) {
  const { register, control, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const hasContaminatedSoilsError = formState.errors.hasContaminatedSoils;

  const options = [
    {
      label: "Oui",
      value: "yes",
    },
    {
      label: "Non/NSP",
      value: "no",
    },
  ];

  return (
    <WizardFormLayout
      title="Les sols de la friche sont-ils pollués ?"
      instructions={
        <>
          <p>
            Les friches sont bien souvent des sites dont les sols (voire les eaux souterraines)
            peuvent être pollués, avec des pollutions multiples, témoignages des activités
            successives sur plusieurs décennies.
          </p>
          <p>
            Ces pollutions (hydrocarbures, composants organiques volatils, cyanures, plomb, etc.)
            peuvent notamment représenter un risque sanitaire préjudiciable à un nouvel usage.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasContaminatedSoils", { required: requiredMessage })}
          options={options}
          error={hasContaminatedSoilsError}
        />
        {watch("hasContaminatedSoils") === "yes" && (
          <div className="fr-pb-7v">
            <SliderNumericInput
              control={control}
              name="contaminatedSurface"
              label="Superficie polluée"
              hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
              minValue={5}
              sliderStartValue={0}
              sliderEndValue={surfaceArea}
              sliderProps={{
                tooltip: {
                  formatter: (value?: number) => value && `${formatNumberFr(value)} m²`,
                },
              }}
            />
          </div>
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SoilContaminationForm;
