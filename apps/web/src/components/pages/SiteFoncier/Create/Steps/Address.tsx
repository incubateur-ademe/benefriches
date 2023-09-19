import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  address: string;
};

function SiteCreationAddressStep({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const error = formState.errors.address;

  return (
    <>
      <h2>Où est située cette prairie ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Adresse du site"
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
          nativeInputProps={register("address", {
            required: "Ce champ est requis",
          })}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default SiteCreationAddressStep;
