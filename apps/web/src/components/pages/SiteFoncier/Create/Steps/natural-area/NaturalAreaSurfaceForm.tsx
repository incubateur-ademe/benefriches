import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { NaturalAreaSpaceType } from "../../../siteFoncier";
import { getLabelForNaturalAreaSpaceType } from "./naturalAreaSpaceTypeLabelMapping";

type Props = {
  spaces: { type: NaturalAreaSpaceType }[];
  onSubmit: (data: FormValues) => void;
};

type FormValues = Record<NaturalAreaSpaceType, number>;

const sumSurfaces = (spaces: FormValues) => {
  return Object.values(spaces).reduce((sum, surface) => {
    if (isNaN(surface)) return sum;
    return surface + sum;
  }, 0);
};

function NaturalAreaSurfaceForm({ spaces, onSubmit }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>();

  return (
    <>
      <h2>Quelles sont les superficies des différents espaces ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {spaces.map(({ type }) => {
          const error = formState.errors[type];
          return (
            <Input
              key={`input-${type}`}
              label={getLabelForNaturalAreaSpaceType(type)}
              hintText="en m2"
              state={error ? "error" : "default"}
              stateRelatedMessage={error ? error.message : undefined}
              nativeInputProps={{
                type: "number",
                ...register(type, {
                  required: "Ce champ est requis",
                  min: 0,
                  valueAsNumber: true,
                }),
                placeholder: "250 000",
              }}
            />
          );
        })}
        <Input
          label="Total superficie de l'espace naturel"
          hintText="en m2"
          nativeInputProps={{
            value: sumSurfaces(watch()),
          }}
          disabled
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default NaturalAreaSurfaceForm;
