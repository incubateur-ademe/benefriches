import { Controller, useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Address, SiteFoncierType } from "../../domain/siteFoncier.types";
import SearchAddressAutocomplete from "./SearchAddressAutocompleteContainer";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteType: SiteFoncierType;
};

type FormValues = {
  selectedAddress?: Address;
  searchText: string;
};

function SiteAddressForm({ onSubmit, onBack, siteType }: Props) {
  const { handleSubmit, formState, control, watch, setValue, register } =
    useForm<FormValues>();

  const error = formState.errors.selectedAddress;

  const title =
    siteType === SiteFoncierType.FRICHE
      ? "Où se situe cette friche ?"
      : "Où se situe cet espace naturel ?";

  register("selectedAddress", {
    required: "L'adresse est nécessaire pour les étapes suivantes",
  });

  return (
    <>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
        <Controller
          control={control}
          name="searchText"
          render={({ field }) => (
            <SearchAddressAutocomplete
              searchInputValue={field.value}
              onSearchInputChange={(searchText: string) => {
                field.onChange(searchText);
                setValue("selectedAddress", undefined);
              }}
              selectedAddress={watch("selectedAddress")}
              onSelect={(v) => {
                setValue("selectedAddress", v);
                setValue("searchText", v.value);
              }}
              searchInputProps={{
                label: "Adresse du site",
                state: error ? "error" : "default",
                stateRelatedMessage: error ? error.message : undefined,
              }}
            />
          )}
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
