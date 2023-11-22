import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
  surfaceArea: number;
};

type HasContaminatedSoilsString = "yes" | "no";

type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface: number;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function SoilContaminationForm({ onSubmit, surfaceArea }: Props) {
  const { register, control, handleSubmit, formState, watch } =
    useForm<FormValues>({
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
    <>
      <h2>Les sols de la friche sont-ils pollués ?</h2>
      <p>
        Les polluants principaux des friches pouvant représenter un risque
        sanitaire : métaux lourds, hydrocarbures, composants organiques
        volatils, pesticides, nitrites, nitrates, cyanures, polychlorobiphényle.
        La pollution à l’amiante n’est pas à renseigner, mais un poste de
        dépense “désamiantage” pourra être alloué dans la partie “création d’un
        projet sur la friche”.
      </p>
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
              hintText="en m2"
              required="Ce champ est requis"
              minValue={5}
              sliderStartValue={0}
              sliderEndValue={surfaceArea}
              sliderProps={{
                tooltip: {
                  formatter: (value?: number) =>
                    value && `${formatNumberFr(value)} m²`,
                },
              }}
            />
          </div>
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SoilContaminationForm;
