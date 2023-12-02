import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";

import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  currentUserCompany: string;
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

function SiteOwnerForm({ onSubmit, currentUserCompany }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const options = [
    {
      label: "La collectivité",
      value: "local_or_regional_authority",
    },
    {
      label: `Mon entreprise, ${currentUserCompany}`,
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

  const ownerTypeSelected = watch("ownerType");
  const shouldAskForOwnerName =
    ownerTypeSelected === "private_individual" ||
    ownerTypeSelected === "other_company";
  const shouldAskForLocalOrAuthorityType =
    ownerTypeSelected === "local_or_regional_authority";

  return (
    <WizardFormLayout title="Qui est le propriétaire de cette friche ?">
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
    </WizardFormLayout>
  );
}

export default SiteOwnerForm;
