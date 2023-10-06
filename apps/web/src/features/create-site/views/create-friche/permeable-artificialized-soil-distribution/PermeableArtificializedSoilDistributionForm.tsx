import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { getLabelForPermeableArtificialSoil } from "../permeable-artificialized-soil-composition/permeableArtificializedSoilLabelMapping";

import { PermeableArtificializedSoil } from "@/features/create-site/domain/friche.types";

type Props = {
  onSubmit: (formValue: FormValues) => void;
  permeableArtificializedSoils: PermeableArtificializedSoil[];
};

type FormValues = Record<PermeableArtificializedSoil, number>;

function PermeableArtificializedSoilDistributionForm({
  onSubmit,
  permeableArtificializedSoils,
}: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();

  return (
    <>
      <h2>
        Quelle est la proportion des différents{" "}
        <strong>sols artificialisés perméables</strong> ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {permeableArtificializedSoils.map((permeableSoilType) => {
          const error = formState.errors[permeableSoilType];
          return (
            <Input
              key={`input-${permeableSoilType}`}
              label={getLabelForPermeableArtificialSoil(permeableSoilType)}
              hintText="en %"
              state={error ? "error" : "default"}
              stateRelatedMessage={error ? error.message : undefined}
              nativeInputProps={{
                type: "number",
                ...register(permeableSoilType, {
                  required: "Ce champ est requis",
                  min: 0,
                  max: 100,
                  valueAsNumber: true,
                }),
                placeholder: "30",
              }}
            />
          );
        })}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PermeableArtificializedSoilDistributionForm;
