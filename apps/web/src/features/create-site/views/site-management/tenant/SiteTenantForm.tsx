import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";

import {
  LoadingState,
  SiteLocalAuthorities,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import LocalAuthoritySelect from "@/shared/views/components/form/LocalAuthoritySelect";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteLocalAuthorities: { loadingState: LoadingState; localAuthorities?: SiteLocalAuthorities };
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

function SiteTenantForm({ onSubmit, onBack, siteLocalAuthorities }: Props) {
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
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteTenantForm;
