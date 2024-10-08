import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useForm } from "react-hook-form";
import { LocalAuthority } from "shared";

import { AvailableProjectStakeholder } from "@/features/create-project/application/stakeholders.selector";
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
    type: LocalAuthority;
    name: string;
  }[];
};

export type FormValues =
  | {
      stakeholder: "local_or_regional_authority";
      localAuthority: LocalAuthority;
      otherStructureName: undefined;
    }
  | {
      stakeholder: "other_structure";
      otherStructureName: string;
      localAuthority: undefined;
    }
  | {
      stakeholder:
        | "user_structure"
        | "site_tenant"
        | "site_owner"
        | "project_developer"
        | "future_site_operator"
        | "unknown";
      localAuthority: undefined;
      otherStructureName: undefined;
    }
  | {
      stakeholder: null;
      localAuthority: undefined;
      otherStructureName: undefined;
    };

function SiteReinstatementContractOwnerForm({
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
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <FormInfo>
          <p>
            Les travaux de remise en état incluent la désimperméabilisation des sols, la
            dépollution, l'enlèvement des déchets, la déconstruction, etc.
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
              label={role === "user_structure" ? `Ma structure, ${name}` : name}
              value={role}
              key={role}
              {...register("stakeholder")}
            />
          ))}

          {availableLocalAuthoritiesStakeholders.length > 0 && (
            <RadioButton
              label="Une collectivité"
              value="local_or_regional_authority"
              {...register("stakeholder")}
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
            {...register("stakeholder")}
          />
          {selectedStakeholder === "other_structure" && (
            <Input
              label={<RequiredLabel label="Nom de la structure" />}
              state={formState.errors.otherStructureName ? "error" : "default"}
              stateRelatedMessage={formState.errors.otherStructureName?.message}
              nativeInputProps={register("otherStructureName", {
                required: "Ce champ est requis",
              })}
            />
          )}
          <RadioButton label="Ne sait pas" value="unknown" {...register("stakeholder")} />
        </Fieldset>
        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={selectedStakeholder !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteReinstatementContractOwnerForm;
