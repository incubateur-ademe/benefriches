import { useForm } from "react-hook-form";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import Button from "@codegouvfr/react-dsfr/Button";
import { SiteFoncierType } from "../../siteFoncier";

type Props = {
  onSubmit: (siteType: SiteFoncierType) => void;
};

type FormValues = {
  type: SiteFoncierType;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function SiteFoncierCreationStepCategory({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(({ type }) => onSubmit(type));
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
      label: "Terre agricole",
      nativeInputProps: {
        disabled: true,
        value: SiteFoncierType.TERRE_AGRICOLE,
        ...register("type", { required: requiredMessage }),
      },
    },
    {
      label: "Prairie",
      nativeInputProps: {
        value: SiteFoncierType.PRAIRIE,
        ...register("type", { required: requiredMessage }),
      },
    },
    {
      label: "Forêt",
      nativeInputProps: {
        disabled: true,
        value: SiteFoncierType.FORET,
        ...register("type", { required: requiredMessage }),
      },
    },
  ];

  return (
    <>
      <h2>De quel type de site s’agit-il ?</h2>
      <form onSubmit={_onSubmit}>
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

export default SiteFoncierCreationStepCategory;