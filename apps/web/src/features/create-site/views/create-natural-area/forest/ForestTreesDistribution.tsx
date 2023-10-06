import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { getLabelForTreeType } from "./treeTypeLabelMapping";

import { TreeType } from "@/features/create-site/domain/naturalArea.types";

type Props = {
  onSubmit: (formValue: FormValues) => void;
  trees: TreeType[];
};

type FormValues = Record<TreeType, number>;

function ForestTreesDistribution({ onSubmit, trees }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();

  return (
    <>
      <h2>
        Quelle est la proportion des différents types d'arbres dans la forêt ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {trees.map((treeType) => {
          const error = formState.errors[treeType];
          return (
            <Input
              key={`input-${treeType}`}
              label={getLabelForTreeType(treeType)}
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

export default ForestTreesDistribution;
