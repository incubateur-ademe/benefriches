import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (address: string) => void;
};

type FormValues = {
  address: string;
};

function PrairieCreationAddressStep({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(({ address }) => {
    onSubmit(address);
  });

  const error = formState.errors.address;

  return (
    <>
      <h2>Où est située cette prairie ?</h2>
      <form onSubmit={_onSubmit}>
        <Input
          label="Adresse du site"
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
          nativeInputProps={register("address", {
            required: "Ce champ est requis",
          })}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PrairieCreationAddressStep;
