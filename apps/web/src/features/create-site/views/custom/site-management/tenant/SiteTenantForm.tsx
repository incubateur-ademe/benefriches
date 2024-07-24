import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  localAuthoritiesList: { type: "municipality" | "epci" | "region" | "department"; name: string }[];
};

export type FormValues =
  | {
      tenantType: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      companyName: undefined;
      tenantName: undefined;
    }
  | {
      tenantType: "company";
      companyName: string;
      localAuthority: undefined;
      tenantName: undefined;
    }
  | {
      tenantType: "private_individual";
      localAuthority: undefined;
      companyName: undefined;
      tenantName: string;
    };

const requiredMessage = "Ce champ est requis";

function SiteTenantForm({ onSubmit, onBack, localAuthoritiesList }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { tenantType: selectedTenantType } = watch();

  return (
    <WizardFormLayout title="Qui est le locataire du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.tenantType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.tenantType ? formState.errors.tenantType.message : undefined
          }
        >
          <RadioButton
            label="Une collectivité"
            value="local_or_regional_authority"
            {...register("tenantType", { required: requiredMessage })}
          />

          {selectedTenantType === "local_or_regional_authority" && (
            <Select
              options={localAuthoritiesList.map(({ type, name }) => ({
                label: name,
                value: type,
              }))}
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
            label="Une entreprise"
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
            label="Un particulier"
            value="private_individual"
            {...register("tenantType", { required: requiredMessage })}
          />

          {selectedTenantType === "private_individual" && (
            <Input
              label={<RequiredLabel label="Nom du particulier" />}
              state={formState.errors.tenantName ? "error" : "default"}
              stateRelatedMessage={formState.errors.tenantName?.message}
              nativeInputProps={register("tenantName", {
                required: "Ce champ est requis",
              })}
            />
          )}
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteTenantForm;
