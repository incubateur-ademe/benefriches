import { useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteSurfaceArea: number;
};

type HasContaminatedSoilsString = "yes" | "no";

export type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface?: number;
};

function SoilContaminationForm({ onSubmit, onBack, siteSurfaceArea }: Props) {
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
          <span className="fr-text--lg">💡</span>
          <p className="fr-text--xs">
            Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
            activités passées, avec potentiellement 2 conséquences&nbsp;:
          </p>
          <ol className="fr-text--xs">
            <li>Un impact sur la qualité des eaux souterraines</li>
            <li>
              La nécessité d’engager des études puis des travaux afin de les traiter et ainsi
              permettre un usage futur sans risques sanitaires. Ces études et travaux représentent
              des dépenses généralement importantes qui contraignent la concrétisation de projets de
              reconversion.
            </li>
          </ol>
          <p className="fr-text--xs">
            Bénéfriches propose des indicateurs liés à la qualité des eaux souterraines et à la
            surface dépolluée.
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

        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SoilContaminationForm;
