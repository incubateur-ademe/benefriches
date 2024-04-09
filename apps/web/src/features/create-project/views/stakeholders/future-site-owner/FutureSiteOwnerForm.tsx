import { useForm } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";

import { ProjectSiteLocalAuthoritiesState } from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import {
  getLocalAuthoritiesExcludedValues,
  isCurrentUserSameSiteStakeholderEntity,
  SiteStakeholder,
} from "@/features/create-project/domain/stakeholders";
import { UserStructure } from "@/features/users/domain/user";
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
  siteStakeholders: SiteStakeholder[];
  currentUserStructure?: UserStructure;
  projectSiteLocalAuthorities: ProjectSiteLocalAuthoritiesState;
};

export type FormValues =
  | {
      futureSiteOwner: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      otherStructureName: undefined;
    }
  | {
      futureSiteOwner: "other_structure";
      otherStructureName: string;
      localAuthority: undefined;
    }
  | {
      futureSiteOwner: "user_company" | "site_tenant" | "unknown";
      localAuthority: undefined;
      otherStructureName: undefined;
    };

const requiredMessage = "Ce champ est requis";

const isCurrentUserSiteOwner = (
  currentUserStructure: UserStructure,
  currentSiteOwner?: SiteStakeholder,
): boolean => isCurrentUserSameSiteStakeholderEntity(currentUserStructure, currentSiteOwner);

const isCurrentUserSiteTenant = (
  currentUserStructure: UserStructure,
  currentSiteTenant: SiteStakeholder,
): boolean => isCurrentUserSameSiteStakeholderEntity(currentUserStructure, currentSiteTenant);

function FutureSiteOwnerForm({
  onSubmit,
  onBack,
  currentUserStructure,
  siteStakeholders,
  projectSiteLocalAuthorities,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedFutureOperator = watch("futureSiteOwner");

  const currentSiteOwner = siteStakeholders.find(({ role }) => role === "site_owner");
  const currentSiteTenant = siteStakeholders.find(({ role }) => role === "site_tenant");

  const shouldDisplayCurrentUserCompanyOption =
    currentUserStructure?.name && !isCurrentUserSiteOwner(currentUserStructure, currentSiteOwner);

  const shouldDisplaySiteTenantOption =
    currentUserStructure && currentSiteTenant
      ? !isCurrentUserSiteTenant(currentUserStructure, currentSiteTenant)
      : false;

  const localAuthoritiesExcludedValues = currentUserStructure
    ? getLocalAuthoritiesExcludedValues(currentUserStructure, siteStakeholders)
    : [];

  return (
    <WizardFormLayout title="Qui sera le nouveau propriétaire du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.futureSiteOwner ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.futureSiteOwner ? formState.errors.futureSiteOwner.message : undefined
          }
        >
          {shouldDisplayCurrentUserCompanyOption && (
            <RadioButton
              label={currentUserStructure.name}
              value="user_company"
              {...register("futureSiteOwner", { required: requiredMessage })}
            />
          )}

          {currentSiteTenant && shouldDisplaySiteTenantOption && (
            <RadioButton
              label={currentSiteTenant.name}
              value="site_tenant"
              {...register("futureSiteOwner", { required: requiredMessage })}
            />
          )}

          <RadioButton
            label={
              localAuthoritiesExcludedValues.length > 0
                ? "Une autre collectivité"
                : "Une collectivité"
            }
            value="local_or_regional_authority"
            {...register("futureSiteOwner", { required: requiredMessage })}
          />

          {selectedFutureOperator === "local_or_regional_authority" && (
            <LocalAuthoritySelect
              data={projectSiteLocalAuthorities.localAuthorities}
              loadingData={projectSiteLocalAuthorities.loadingState}
              excludedValues={localAuthoritiesExcludedValues}
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
            {...register("futureSiteOwner", { required: requiredMessage })}
          />

          {selectedFutureOperator === "other_structure" && (
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
            {...register("futureSiteOwner", { required: requiredMessage })}
          />
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default FutureSiteOwnerForm;
