import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";

import { OwnerType } from "@/features/create-site/domain/friche.types";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  ownerType: OwnerOptions;
  localAndRegionalAuthorityType?: (typeof localAndRegionalAuthorityOptions)[number]["value"];
  ownerName?: string;
};

type OwnerOptions =
  | "PRIVATE_INDIVIDUAL" // particulier
  | "LOCAL_OR_REGIONAL_AUTHORITY" // collectivité
  | "USER_COMPANY"
  | "OTHER_COMPANY";

const localAndRegionalAuthorityOptions = [
  { label: "Commune", value: OwnerType.MUNICIPALITY },
  {
    label: "Communauté de communes / Agglomération",
    value: OwnerType.COMMUNITY_OF_MUNICIPALITIES,
  },
  { label: "Département", value: OwnerType.DEPARTMENT },
  { label: "Région", value: OwnerType.REGION },
  { label: "L'État", value: OwnerType.STATE },
];

const requiredMessage = "Champ requis";

const options = [
  {
    label: "La collectivité",
    value: "LOCAL_OR_REGIONAL_AUTHORITY",
  },
  {
    label: "Mon entreprise",
    value: "USER_COMPANY",
  },
  {
    label: "Une autre entreprise",
    value: "OTHER_COMPANY",
  },
  {
    label: "Un particulier",
    value: "PRIVATE_INDIVIDUAL",
  },
];

function FricheOwnerForm({ onSubmit }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const _options = options.map((option) => {
    return {
      label: option.label,
      nativeInputProps: {
        value: option.value,
        ...register("ownerType", { required: requiredMessage }),
      },
    };
  });

  const { ownerType: ownerTypeError, ownerName: ownerNameError } =
    formState.errors;
  const ownerTypeSelected = watch("ownerType");
  const shouldAskForOwnerName = [
    "OTHER_COMPANY",
    "PRIVATE_INDIVIDUAL",
  ].includes(ownerTypeSelected);
  const shouldAskForLocalOrAuthorityType =
    ownerTypeSelected === "LOCAL_OR_REGIONAL_AUTHORITY";

  return (
    <>
      <h2>Qui est le propriétaire de cette friche ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={_options}
          state={ownerTypeError ? "error" : "default"}
          stateRelatedMessage={
            ownerTypeError ? ownerTypeError.message : undefined
          }
        />

        {shouldAskForOwnerName && (
          <Input
            label=""
            state={ownerNameError ? "error" : "default"}
            stateRelatedMessage={
              ownerNameError ? ownerNameError.message : undefined
            }
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

export default FricheOwnerForm;
