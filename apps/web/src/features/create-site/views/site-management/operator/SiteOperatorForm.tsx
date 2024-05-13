import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import { LoadingState } from "@/features/create-site/application/siteMunicipalityData.reducer";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  localAuthoritiesList: { type: "municipality" | "epci" | "region" | "department"; name: string }[];
  localAuthoritiesLoadingState: LoadingState;
};

export type FormValues =
  | {
      operatorStructureType: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      name: undefined;
    }
  | {
      operatorStructureType: "company" | "private_individual";
      name: string;
      localAuthority: undefined;
    };

const requiredMessage = "Ce champ est requis";

function SiteOperatorForm({
  onSubmit,
  onBack,
  localAuthoritiesList,
  localAuthoritiesLoadingState,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { operatorStructureType: selectedOperatorStructureType } = watch();

  return (
    <WizardFormLayout title="Qui est l’exploitant du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.operatorStructureType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.operatorStructureType
              ? formState.errors.operatorStructureType.message
              : undefined
          }
        >
          <RadioButton
            label="Une collectivité"
            value="local_or_regional_authority"
            {...register("operatorStructureType", { required: requiredMessage })}
          />

          {selectedOperatorStructureType === "local_or_regional_authority" && (
            <>
              {localAuthoritiesLoadingState === "loading" ? (
                <LoadingSpinner />
              ) : (
                <Select
                  options={
                    localAuthoritiesLoadingState === "error"
                      ? localAuthoritiesList.map(({ type, name }) => ({
                          label: name,
                          value: type,
                        }))
                      : localAuthoritiesList.map(({ type, name }) => ({
                          label: formatLocalAuthorityName(type, name),
                          value: type,
                        }))
                  }
                  label={<RequiredLabel label="Type de collectivité" />}
                  placeholder="Sélectionnez un type de collectivité"
                  state={formState.errors.localAuthority ? "error" : "default"}
                  stateRelatedMessage={formState.errors.localAuthority?.message}
                  nativeSelectProps={register("localAuthority", {
                    required: "Ce champ est requis",
                  })}
                />
              )}
            </>
          )}
          <RadioButton
            label="Une entreprise"
            value="company"
            {...register("operatorStructureType", { required: requiredMessage })}
          />

          {selectedOperatorStructureType === "company" && (
            <Input
              label={<RequiredLabel label="Nom de l'entreprise" />}
              state={formState.errors.name ? "error" : "default"}
              stateRelatedMessage={formState.errors.name?.message}
              nativeInputProps={register("name", {
                required: "Ce champ est requis",
              })}
            />
          )}

          <RadioButton
            label="Un particulier"
            value="private_individual"
            {...register("operatorStructureType", { required: requiredMessage })}
          />

          {selectedOperatorStructureType === "private_individual" && (
            <Input
              label={<RequiredLabel label="Nom du particulier" />}
              state={formState.errors.name ? "error" : "default"}
              stateRelatedMessage={formState.errors.name?.message}
              nativeInputProps={register("name", {
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

export default SiteOperatorForm;
