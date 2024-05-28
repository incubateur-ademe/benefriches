import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
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
  currentUserStructureName?: string;
  localAuthoritiesList: { type: "municipality" | "epci" | "region" | "department"; name: string }[];
  localAuthoritiesLoadingState: LoadingState;
  isFriche: boolean;
};

export type FormValues =
  | {
      ownerType: "user_company";
      localAuthority: undefined;
      ownerName: undefined;
    }
  | {
      ownerType: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      ownerName: undefined;
    }
  | {
      ownerType: "private_individual" | "other_company";
      ownerName: string;
      localAuthority: undefined;
    };

const requiredMessage = "Ce champ requis pour la suite du formulaire";

function SiteOwnerForm({
  onSubmit,
  onBack,
  currentUserStructureName,
  localAuthoritiesLoadingState,
  localAuthoritiesList,
  isFriche,
}: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const ownerTypeSelected = watch("ownerType");
  const shouldAskForPrivateName = ownerTypeSelected === "private_individual";
  const shouldAskForCompanyName = ownerTypeSelected === "other_company";
  const shouldAskForLocalAuthorityType = ownerTypeSelected === "local_or_regional_authority";

  return (
    <WizardFormLayout title={`Qui est le propriétaire ${isFriche ? "de la friche" : "du site"}?`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.ownerType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.ownerType ? formState.errors.ownerType.message : undefined
          }
        >
          <RadioButton
            label="Une collectivité"
            value="local_or_regional_authority"
            {...register("ownerType", { required: requiredMessage })}
          />
          {shouldAskForLocalAuthorityType && (
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
          {currentUserStructureName && (
            <RadioButton
              label={`Mon entreprise, ${currentUserStructureName}`}
              value="user_company"
              {...register("ownerType", { required: requiredMessage })}
            />
          )}
          <RadioButton
            label={`Une entreprise`}
            value="other_company"
            {...register("ownerType", { required: requiredMessage })}
          />
          {shouldAskForCompanyName && (
            <Input
              label={<RequiredLabel label="Nom de l'entreprise" />}
              state={formState.errors.ownerName ? "error" : "default"}
              stateRelatedMessage={formState.errors.ownerName?.message}
              nativeInputProps={register("ownerName", {
                required: "Ce champ est requis",
                shouldUnregister: true,
              })}
            />
          )}
          <RadioButton
            label={`Un particulier`}
            value="private_individual"
            {...register("ownerType", { required: requiredMessage })}
          />
          {shouldAskForPrivateName && (
            <Input
              label={<RequiredLabel label="Nom du particulier" />}
              state={formState.errors.ownerName ? "error" : "default"}
              stateRelatedMessage={formState.errors.ownerName?.message}
              nativeInputProps={register("ownerName", {
                required: "Ce champ est requis",
                shouldUnregister: true,
              })}
            />
          )}
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteOwnerForm;
