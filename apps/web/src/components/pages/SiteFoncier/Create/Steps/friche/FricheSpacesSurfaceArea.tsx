import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { FricheSpaceType } from "../../../siteFoncier";

import { getSurfaceTypeLabel } from "@/helpers/getLabelForValue";

type Props = {
  spaces: { type: FricheSpaceType }[];
  onSubmit: (data: FormValues) => void;
};

type FormValues = Record<FricheSpaceType, number>;

const sumSurfaces = (spaces: FormValues) => {
  return Object.values(spaces).reduce((sum, surface) => {
    if (isNaN(surface)) return sum;
    return surface + sum;
  }, 0);
};

function FricheSpacesSurfaceAreaForm({ spaces, onSubmit }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  return (
    <>
      <h2>Quelles sont les superficies des différents espaces ?</h2>
      <form onSubmit={_onSubmit}>
        {spaces.map(({ type }) => (
          <Input
            key={`input-${type}`}
            label={getSurfaceTypeLabel(type)}
            hintText="en m2"
            nativeInputProps={{
              type: "number",
              ...register(type, {
                min: 0,
                valueAsNumber: true,
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

export default FricheSpacesSurfaceAreaForm;
