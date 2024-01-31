import { Controller, useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Address } from "../../domain/siteFoncier.types";
import SearchAddressAutocomplete from "./SearchAddressAutocompleteContainer";

import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (address: Address) => void;
  isFriche: boolean;
};

type FormValues = {
  selectedAddress?: Address;
  searchText: string;
};

function SiteAddressForm({ onSubmit, isFriche }: Props) {
  const { handleSubmit, formState, control, watch, setValue, register } = useForm<FormValues>();

  const error = formState.errors.selectedAddress;

  const title = isFriche ? "Où est située cette friche ?" : "Où est situé ce site ?";

  register("selectedAddress", {
    required: "L'adresse est nécessaire pour les étapes suivantes",
  });

  return (
    <>
      <WizardFormLayout
        title={title}
        instructions={
          <div>
            <p>Bénéfriches a besoin de connaître l'adresse du site.</p>
            <p>
              Si vous ne connaissez pas l'adresse exacte, entrez simplement le nom de la commune ou
              son code postal.
            </p>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit((formData: FormValues) => {
            onSubmit(formData.selectedAddress!);
          })}
        >
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
                  label: <RequiredLabel label="Adresse du site" />,
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
                children: "Suivant",
                nativeButtonProps: { type: "submit" },
              },
            ]}
          />
        </form>
      </WizardFormLayout>
    </>
  );
}

export default SiteAddressForm;
