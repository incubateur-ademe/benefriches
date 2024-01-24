import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

import { SiteLocalAuthoritiesState } from "@/features/create-site/application/siteLocalAuthorities.reducer";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import LocalAuthoritySelect from "@/shared/views/components/form/LocalAuthoritySelect";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteLocalAuthorities: SiteLocalAuthoritiesState;
};

export type FormValues =
  | {
      tenantType: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      companyName: undefined;
    }
  | {
      tenantType: "company";
      companyName: string;
      localAuthority: undefined;
    }
  | { tenantType: "unknown"; localAuthority: undefined; companyName: undefined };

const requiredMessage = "Ce champ est requis";

function SiteTenantForm({ onSubmit, siteLocalAuthorities }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { tenantType: selectedTenantType } = watch();

  return (
    <WizardFormLayout title="Le site est-il encore loué par un exploitant ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.tenantType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.tenantType ? formState.errors.tenantType.message : undefined
          }
        >
          <RadioButton
            label="Oui, par une collectivité"
            value="local_or_regional_authority"
            {...register("tenantType", { required: requiredMessage })}
          />

          {selectedTenantType === "local_or_regional_authority" && (
            <LocalAuthoritySelect
              data={siteLocalAuthorities.localAuthorities}
              loadingData={siteLocalAuthorities.loadingState}
              label={<RequiredLabel label="Type de collectivité" />}
              placeholder="Sélectionnez un type de collectivité"
              state={formState.errors.localAuthority ? "error" : "default"}
              stateRelatedMessage={formState.errors.localAuthority?.message}
              nativeSelectProps={register("localAuthority", {
                required: "Ce champ est requis",
              })}
            />
          )}
          <RadioButton
            label="Oui, par une entreprise"
            value="company"
            {...register("tenantType", { required: requiredMessage })}
          />

          {selectedTenantType === "company" && (
            <Input
              label={<RequiredLabel label="Nom de l'entreprise" />}
              state={formState.errors.companyName ? "error" : "default"}
              stateRelatedMessage={formState.errors.companyName?.message}
              nativeInputProps={register("companyName", {
                required: "Ce champ est requis",
              })}
            />
          )}

          <RadioButton
            label="Non / NSP"
            value="unknown"
            {...register("tenantType", { required: requiredMessage })}
          />
        </Fieldset>
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteTenantForm;
