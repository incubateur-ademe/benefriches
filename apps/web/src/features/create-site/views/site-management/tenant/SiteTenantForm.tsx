import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues =
  | {
      tenantType: "local_or_regional_authority";
      localOrRegionalAuthority: LocalAndRegionalAuthority;
    }
  | {
      tenantType: "company";
      companyName: string;
    }
  | { tenantType: "unknown" };

const requiredMessage = "Ce champ est requis";

const tenantOptions = [
  {
    label: "Oui, par une collectivité",
    value: "local_or_regional_authority",
  },
  {
    label: "Oui, par une entreprise",
    value: "company",
  },
  {
    label: "Non / NSP",
    value: "unknown",
  },
];

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

function SiteTenantForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedTenantType = watch("tenantType");

  return (
    <WizardFormLayout title="Le site est-il encore loué par un exploitant ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("tenantType", { required: requiredMessage })}
          options={tenantOptions}
          error={formState.errors.tenantType}
        />
        {selectedTenantType === "local_or_regional_authority" && (
          <Select
            label="Type de collectivité"
            placeholder="Sélectionnez un type de collectivité"
            nativeSelectProps={register("localOrRegionalAuthority", {
              required: "Ce champ est requis",
            })}
            options={localAndRegionalAuthorityOptions}
          />
        )}
        {selectedTenantType === "company" && (
          <Input
            label="Raison sociale de l'entreprise"
            nativeInputProps={register("companyName", {
              required: "Ce champ est requis",
            })}
          />
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteTenantForm;
