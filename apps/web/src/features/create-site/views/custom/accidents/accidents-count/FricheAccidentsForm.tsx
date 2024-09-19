import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type HasRecentAccidentsStringOption = "yes" | "no" | null;

export type FormValues = {
  hasRecentAccidents: HasRecentAccidentsStringOption;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
};

function FricheAccidentsForm({ onSubmit, onBack }: Props) {
  const { register, control, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { hasRecentAccidents: hasRecentAccidentsError } = formState.errors;

  const {
    hasRecentAccidents: hasRecentAccidentsValue,
    accidentsMinorInjuries,
    accidentsSevereInjuries,
    accidentsDeaths,
  } = watch();
  const hasRecentAccidents = watch("hasRecentAccidents") === "yes";

  const isValid = hasRecentAccidents
    ? accidentsMinorInjuries || accidentsSevereInjuries || accidentsDeaths
    : true;

  return (
    <WizardFormLayout
      title="Y a-t-il eu des accidents sur la friche ces 5 dernières années ?"
      instructions={
        <FormInfo>
          <p>Personnes entrées illégalement sur la friche et s'étant blessées ou tuées.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={hasRecentAccidentsError ? "error" : "default"}
          stateRelatedMessage={
            hasRecentAccidentsError ? hasRecentAccidentsError.message : undefined
          }
        >
          <RadioButton label="Oui" value="yes" {...register("hasRecentAccidents")} />
          {hasRecentAccidents && (
            <>
              <NumericInput
                name="accidentsMinorInjuries"
                label="Nombre de blessés légers"
                control={control}
                allowDecimals={false}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
              <NumericInput
                name="accidentsSevereInjuries"
                label="Nombre de blessés graves"
                control={control}
                allowDecimals={false}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
              <NumericInput
                name="accidentsDeaths"
                label="Nombre de décès"
                control={control}
                allowDecimals={false}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
            </>
          )}
          <RadioButton label="Non / Ne sait pas" value="no" {...register("hasRecentAccidents")} />
        </Fieldset>
        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!isValid}
          nextLabel={hasRecentAccidentsValue !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default FricheAccidentsForm;
