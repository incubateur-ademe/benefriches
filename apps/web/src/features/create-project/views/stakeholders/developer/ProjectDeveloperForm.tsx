import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import { AvailableProjectStakeholder } from "@/features/create-project/application/stakeholders.selector";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: {
    type: "municipality" | "epci" | "region" | "department";
    name: string;
  }[];
};

export type FormValues =
  | {
      stakeholder: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      otherStructureName: undefined;
    }
  | {
      stakeholder: "other_structure";
      otherStructureName: string;
      localAuthority: undefined;
    }
  | {
      stakeholder: "user_company" | "site_tenant" | "site_owner" | "unknown";
      localAuthority: undefined;
      otherStructureName: undefined;
    };

const requiredMessage = "Ce champ est requis";

function DeveloperForm({
  onSubmit,
  onBack,
  availableStakeholdersList,
  availableLocalAuthoritiesStakeholders,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedStakeholder = watch("stakeholder");

  return (
    <WizardFormLayout
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          <p>
            L’aménageur est l’acteur qui va engager la reconversion du site. Le bilan économique de
            l’opération sera donc à sa charge.
          </p>
          <p>
            L’aménageur peut aussi être l’exploitant du site ; la question sera posée dans l’étape
            suivante.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.stakeholder ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.stakeholder ? formState.errors.stakeholder.message : undefined
          }
        >
          {availableStakeholdersList.map(({ name, role }) => (
            <RadioButton
              label={role === "user_company" ? `Ma structure, ${name}` : name}
              value={role}
              key={role}
              {...register("stakeholder", { required: requiredMessage })}
            />
          ))}
          {availableLocalAuthoritiesStakeholders.length > 0 && (
            <RadioButton
              label="Une collectivité"
              value="local_or_regional_authority"
              {...register("stakeholder", { required: requiredMessage })}
            />
          )}

          {selectedStakeholder === "local_or_regional_authority" && (
            <Select
              options={availableLocalAuthoritiesStakeholders.map(({ type, name }) => ({
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
            label="Une autre structure"
            value="other_structure"
            {...register("stakeholder", { required: requiredMessage })}
          />
          {selectedStakeholder === "other_structure" && (
            <Input
              label="Nom de la structure"
              state={formState.errors.otherStructureName ? "error" : "default"}
              stateRelatedMessage={formState.errors.otherStructureName?.message}
              nativeInputProps={register("otherStructureName", {
                required: "Ce champ est requis",
              })}
            />
          )}
          <RadioButton
            label="Ne sait pas"
            value="unknown"
            {...register("stakeholder", { required: requiredMessage })}
          />
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default DeveloperForm;
