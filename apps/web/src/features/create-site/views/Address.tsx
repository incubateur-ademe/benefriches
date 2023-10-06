import { Controller, useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import BaseAdresseNationaleAutocomplete from "../../../components/pages/SiteFoncier/Create/BaseAddressNationale/AutocompleteField";
import { SiteFoncierType } from "../domain/siteFoncier.types";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteType: SiteFoncierType;
};

type FormValues = {
  location: { address: string };
};

function SiteAddressForm({ onSubmit, onBack, siteType }: Props) {
  const { register, handleSubmit, formState, control } = useForm<FormValues>();

  const error = formState.errors.location;

  const { name } = register("location", { required: "Ce champ est requis" });

  const title =
    siteType === SiteFoncierType.FRICHE
      ? "Où se situe cette friche ?"
      : "Où se situe cet espace naturel ?";

  return (
    <>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          render={({ field: { ref, ...fieldRest } }) => (
            <BaseAdresseNationaleAutocomplete
              {...fieldRest}
              inputRef={ref}
              inputProps={{
                label: "Adresse du site",
                state: error ? "error" : "default",
                stateRelatedMessage: error ? error.message : undefined,
              }}
            />
          )}
          control={control}
          name={name}
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

export default SiteAddressForm;
