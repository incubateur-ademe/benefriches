import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { VegetationType } from "../../../../siteFoncier";
import { getLabelForVegetationType } from "./vegetationTypeLabelMapping";

type Props = {
  onSubmit: (formValue: FormValues) => void;
  vegetation: VegetationType[];
};

type FormValues = Record<VegetationType, number>;

function PrairieVegetationDistributionForm({ onSubmit, vegetation }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();

  return (
    <>
      <h2>
        Quelle est la proportion des différentes végétations sur la prairie ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {vegetation.map((treeType) => {
          const error = formState.errors[treeType];
          return (
            <Input
              key={`input-${treeType}`}
              label={getLabelForVegetationType(treeType)}
              hintText="en %"
              state={error ? "error" : "default"}
              stateRelatedMessage={error ? error.message : undefined}
              nativeInputProps={{
                type: "number",
                ...register(treeType, {
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

export default PrairieVegetationDistributionForm;
