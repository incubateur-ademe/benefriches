import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";

import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues =
  | {
      ownerType: "user_company";
      localAndRegionalAuthorityType: undefined;
      ownerName: undefined;
    }
  | {
      ownerType: "local_or_regional_authority";
      localAndRegionalAuthorityType: LocalAndRegionalAuthority;
      ownerName: undefined;
    }
  | {
      ownerType: "private_individual" | "other_company";
      ownerName: string;
      localAndRegionalAuthorityType: undefined;
    };

const localAndRegionalAuthorityOptions = (
  [
    "municipality",
    "community_of_municipalities",
    "department",
    "region",
    "state",
  ] as const
).map((localOrRegionalAuthority) => ({
  label: getLabelForLocalOrRegionalAuthority(localOrRegionalAuthority),
  value: localOrRegionalAuthority,
}));

const requiredMessage = "Champ requis";

const options = [
  {
    label: "La collectivité",
    value: "local_or_regional_authority",
  },
  {
    label: "Mon entreprise",
    value: "user_company",
  },
  {
    label: "Une autre entreprise",
    value: "other_company",
  },
  {
    label: "Un particulier",
    value: "private_individual",
  },
];

function SiteOwnerForm({ onSubmit }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const ownerTypeSelected = watch("ownerType");
  const shouldAskForOwnerName =
    ownerTypeSelected === "private_individual" ||
    ownerTypeSelected === "other_company";
  const shouldAskForLocalOrAuthorityType =
    ownerTypeSelected === "local_or_regional_authority";

  return (
    <>
      <h2>Qui est le propriétaire de cette friche ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("ownerType", { required: requiredMessage })}
          options={options}
          error={formState.errors.ownerType}
        />

        {shouldAskForOwnerName && (
          <Input
            label=""
            state={formState.errors.ownerName ? "error" : "default"}
            stateRelatedMessage={formState.errors.ownerName?.message}
            nativeInputProps={{
              placeholder: "Nom de l'entreprise ou du particulier",
              ...register("ownerName", {
                required: "Ce champ est requis",
                shouldUnregister: true,
              }),
            }}
          />
        )}
        {shouldAskForLocalOrAuthorityType && (
          <Select
            label="Type de collectivité"
            placeholder="Sélectionnez un type de collectivité"
            nativeSelectProps={register("localAndRegionalAuthorityType")}
            options={localAndRegionalAuthorityOptions}
          />
        )}
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
    </>
  );
}

export default SiteOwnerForm;
