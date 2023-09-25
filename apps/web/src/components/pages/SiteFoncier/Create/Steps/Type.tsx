import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { SiteFoncierType } from "../../siteFoncier";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  type: SiteFoncierType;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function SiteFoncierCreationStepType({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const error = formState.errors.type;

  const _options = [
    {
      label: "Friche",
      nativeInputProps: {
        value: SiteFoncierType.FRICHE,
        ...register("type", { required: requiredMessage }),
      },
    },
    {
      label: "Espace naturel",
      nativeInputProps: {
        value: SiteFoncierType.NATURAL_AREA,
        ...register("type", { required: requiredMessage }),
      },
    },
    {
      label: "Espace agricole",
      nativeInputProps: {
        disabled: true,
        value: SiteFoncierType.AGRICULTURAL_LAND,
        ...register("type", { required: requiredMessage }),
      },
    },
  ];

  return (
    <>
      <h2>De quel type de site s’agit-il ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={_options}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SiteFoncierCreationStepType;
