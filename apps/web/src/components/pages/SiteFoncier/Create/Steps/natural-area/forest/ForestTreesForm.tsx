import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForTreeType } from "./treeTypeLabelMapping";

import { TreeType } from "@/components/pages/SiteFoncier/naturalArea";

type Props = {
  onSubmit: (formValue: FormValues) => void;
};

type FormValues = Record<TreeType, boolean>;

const options = Object.values(TreeType).map((treeType) => ({
  value: treeType,
  label: getLabelForTreeType(treeType),
}));

function ForestTreesForm({ onSubmit }: Props) {
  const { handleSubmit, register } = useForm<FormValues>();

  const checkboxOptions = options.map((option) => ({
    label: option.label,
    nativeInputProps: register(option.value),
  }));

  return (
    <>
      <h2>Quels types d'arbres y a-t-il dans la forêt ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox options={checkboxOptions} />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default ForestTreesForm;
