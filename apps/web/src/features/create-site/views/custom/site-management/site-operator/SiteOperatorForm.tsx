import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useForm } from "react-hook-form";
import { LocalAuthority } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  currentOwnerStructureName: string;
  localAuthoritiesList: { type: LocalAuthority; name: string }[];
};

export type FormValues =
  | {
      operator: "site_owner";
      localAuthority: undefined;
      companyName: undefined;
      operatorName: undefined;
    }
  | {
      operator: "local_or_regional_authority";
      localAuthority: LocalAuthority;
      companyName: string;
      operatorName: string;
    }
  | {
      operator: "company";
      companyName: string;
      operatorName: undefined;
      localAuthority: undefined;
    }
  | {
      operator: "private_individual";
      companyName: undefined;
      operatorName: string;
      localAuthority: undefined;
    };

const requiredMessage = "Ce champ est requis";

function SiteOperatorForm({
  onSubmit,
  onBack,
  localAuthoritiesList,
  currentOwnerStructureName,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { operator: selectedOperator } = watch();

  return (
    <WizardFormLayout title="Qui est l'exploitant ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.operator ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.operator ? formState.errors.operator.message : undefined
          }
        >
          <RadioButton
            label={`Le propriétaire actuel du site, ${currentOwnerStructureName}`}
            value="site_owner"
            {...register("operator", { required: requiredMessage })}
          />

          <RadioButton
            label="Une collectivité"
            value="local_or_regional_authority"
            {...register("operator", { required: requiredMessage })}
          />

          {selectedOperator === "local_or_regional_authority" && (
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
            {...register("operator", { required: requiredMessage })}
          />

          {selectedOperator === "company" && (
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
            {...register("operator", { required: requiredMessage })}
          />

          {selectedOperator === "private_individual" && (
            <Input
              label={<RequiredLabel label="Nom du particulier" />}
              state={formState.errors.operatorName ? "error" : "default"}
              stateRelatedMessage={formState.errors.operatorName?.message}
              nativeInputProps={register("operatorName", {
                required: "Ce champ est requis",
              })}
            />
          )}
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteOperatorForm;
