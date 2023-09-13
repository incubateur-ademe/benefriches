import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import Button from "@codegouvfr/react-dsfr/Button";
import { FricheSurfaceType } from "../../../siteFoncier";
import { getSurfaceTypeLabel } from "@/helpers/getLabelForValue";

type Props = {
  surfaces: { type: FricheSurfaceType }[];
  onSubmit: (data: FormValues) => void;
};

type FormValues = Record<FricheSurfaceType, number>;

const sumSurfaces = (surfaces: FormValues) => {
  // TODO: remove the + number conversion
  return Object.values(surfaces).reduce((surface, sum) => +surface + sum, 0);
};

function FricheSurfacesDistribution({ surfaces = [], onSubmit }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  return (
    <>
      <h2>Quelles sont les superficies des différents espaces ?</h2>
      <form onSubmit={_onSubmit}>
        {surfaces.map(({ type }) => (
          <Input
            key={`input-${type}`}
            label={getSurfaceTypeLabel(type)}
            hintText="en m2"
            nativeInputProps={{
              type: "number",
              ...register(type, {
                min: 0,
              }),
            }}
          />
        ))}
        <Input
          label="Total superficie de la friche"
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

export default FricheSurfacesDistribution;
