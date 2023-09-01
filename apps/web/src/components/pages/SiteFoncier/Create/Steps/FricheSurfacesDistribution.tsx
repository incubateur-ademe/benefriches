import { getSurfaceCategoryLabel } from "@/helpers/getLabelForValue";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useContext, useState } from "react";
import { FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import { TContext } from "../StateMachine";
import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";

const KEY = "surfaces";
const ERROR_MESSAGE = "Cette valeur est requise";

function SiteFoncierCreationStepFricheSurfacesDistribution() {
  const [totalArea, setTotalArea] = useState(0);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const { computeTotalSurface } = useContext(SiteFoncierPublicodesContext);

  const { fields } = useFieldArray<TContext, "surfaces", "id">({
    name: "surfaces",
    control,
  });

  const onBlur = () => {
    //setSurfaceSituation(fields);
    setTotalArea(computeTotalSurface());
  };

  const surfacesErrors = errors[KEY] as FieldErrors;
  return (
    <>
      <h2>Quelles sont les superficies des différents espaces ?</h2>

      {fields.map((field, index) => (
        <div key={field.id}>
          <Input
            label={getSurfaceCategoryLabel(field.category)}
            hintText="Superficie en m²"
            state="default"
            key={field.id}
            nativeInputProps={{
              ...register(`surfaces.${index}.superficie` as const, {
                required: ERROR_MESSAGE,
              }),
              onBlur,
              inputMode: "numeric",
              pattern: "[0-9]*",
              type: "number",
              placeholder: "5000",
            }}
          />
          {surfacesErrors && surfacesErrors[index] && <p>{ERROR_MESSAGE}</p>}
        </div>
      ))}

      <Input
        label="Surface totale de la friche"
        hintText="Superficie en m²"
        disabled
        nativeInputProps={{
          value: totalArea,
        }}
      />
    </>
  );
}

export default SiteFoncierCreationStepFricheSurfacesDistribution;
