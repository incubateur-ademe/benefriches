import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type HasContaminatedSoilsString = "yes" | "no";

export type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface?: number;
};

function SoilContaminationForm({ onSubmit, siteSurfaceArea }: Props) {
  const { register, control, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const hasContaminatedSoilsError = formState.errors.hasContaminatedSoils;
  const contaminatedSurfaceHintText = `en ${SQUARE_METERS_HTML_SYMBOL} (maximum ${formatNumberFr(
    siteSurfaceArea,
  )} ${SQUARE_METERS_HTML_SYMBOL})`;

  const hasContaminatedSoilsValue = watch("hasContaminatedSoils");
  const hasContaminatedSoils = hasContaminatedSoilsValue === "yes";

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
        <Fieldset
          state={hasContaminatedSoilsError ? "error" : "default"}
          stateRelatedMessage={
            hasContaminatedSoilsError ? hasContaminatedSoilsError.message : undefined
          }
        >
          <RadioButton label="Oui" value="yes" {...register("hasContaminatedSoils")} />
          {hasContaminatedSoils && (
            <div className="fr-pb-7v">
              <NumericInput
                control={control}
                label={<RequiredLabel label="Superficie polluée" />}
                hintText={contaminatedSurfaceHintText}
                name="contaminatedSurface"
                rules={{
                  required: "Ce champ est requis",
                  min: {
                    value: 0,
                    message: "Veuillez sélectionner une surface valide.",
                  },
                  max: {
                    value: siteSurfaceArea,
                    message:
                      "La superficie polluée ne peut être supérieure à la superficie du site.",
                  },
                }}
              />
            </div>
          )}
          <RadioButton {...register("hasContaminatedSoils")} label="Non" value="no" />
        </Fieldset>

        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SoilContaminationForm;
