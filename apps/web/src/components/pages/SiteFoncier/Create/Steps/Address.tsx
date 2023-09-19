import { Controller, useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import BaseAdresseNationaleAutocomplete from "../Fields/BaseAdresseNationaleAutocomplete";
import { SiteFoncier } from "../../siteFoncier";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  location: SiteFoncier["location"];
};

function SiteCreationAddressStep({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, control } = useForm<FormValues>();

  const error = formState.errors.location;

  return (
    <>
      <h2>Où est située cette prairie ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          render={({ field }) => (
            <BaseAdresseNationaleAutocomplete
              {...field}
              inputProps={{
                label: "Adresse du site",
                state: error ? "error" : "default",
                stateRelatedMessage: error ? error.message : undefined,
              }}
            />
          )}
          control={control}
          {...register("location", { required: "Ce champ est requis" })}
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
