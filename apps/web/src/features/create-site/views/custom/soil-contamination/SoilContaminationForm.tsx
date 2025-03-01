import { useForm } from "react-hook-form";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteSurfaceArea: number;
  initialValues: FormValues;
};

type HasContaminatedSoilsString = "yes" | "no" | null;

export type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface?: number;
};

function SoilContaminationForm({ initialValues, onSubmit, onBack, siteSurfaceArea }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: initialValues,
  });

  const hasContaminatedSoilsError = formState.errors.hasContaminatedSoils;
  const contaminatedSurfaceHintText = `(maximum ${formatSurfaceArea(siteSurfaceArea)})`;

  const hasContaminatedSoilsValue = watch("hasContaminatedSoils");
  const hasContaminatedSoils = hasContaminatedSoilsValue === "yes";

  return (
    <WizardFormLayout
      title="Les sols de la friche sont-ils pollués ?"
      instructions={
        <FormDefinition hideDivider>
          <p>
            Les activités antérieures exercées sur le site, qu'elles soient industrielles (fonderie,
            textiles, travail des métaux, etc.), de service (stations-services…), ferroviaire, etc.
            ont pu être à l'origine de pollution des sols.
          </p>
          <p>
            Donner un nouvel usage à un site présentant des pollutions (ex : hydrocarbures,
            solvants, métaux lourds) nécessitera vraisemblablement des mesures de gestion pour
            abaisser les niveaux de contamination et assurer la maîtrise des éventuels risques
            sanitaires.
          </p>
          <p>
            La pollution à l'amiante des bâtiments n'est pas à considérer ici, mais un poste de
            dépense "désamiantage" pourra être alloué, le cas échéant, dans la partie “création d'un
            projet sur la friche”.
          </p>
        </FormDefinition>
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
            <div className="tw-pb-7">
              <RowDecimalsNumericInput
                label={<RequiredLabel label="Superficie polluée" />}
                addonText={SQUARE_METERS_HTML_SYMBOL}
                hintText={contaminatedSurfaceHintText}
                nativeInputProps={register("contaminatedSurface", {
                  ...requiredNumericFieldRegisterOptions,
                  max: {
                    value: siteSurfaceArea,
                    message:
                      "La superficie polluée ne peut être supérieure à la superficie du site.",
                  },
                })}
              />
            </div>
          )}
          <RadioButton {...register("hasContaminatedSoils")} label="Non / Ne sait pas" value="no" />
        </Fieldset>

        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={hasContaminatedSoilsValue !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilContaminationForm;
