import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";

import { OwnerType } from "@/features/create-site/domain/siteFoncier.types";
import { LocalAndRegionalAuthority } from "@/shared/domain/localOrRegionalAuthority";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  ownerType: OwnerOptions;
  localAndRegionalAuthorityType?: LocalAndRegionalAuthority;
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

function SiteOwnerForm({ onSubmit }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
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
          {...register("ownerType", { required: requiredMessage })}
          options={options}
          error={ownerTypeError}
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

export default SiteOwnerForm;
