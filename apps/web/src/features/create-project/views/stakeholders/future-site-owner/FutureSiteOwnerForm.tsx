import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";

import { ProjectSiteLocalAuthoritiesState } from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import {
  getLocalAuthoritiesExcludedValues,
  isCurrentUserSameSiteStakeholderEntity,
  SiteStakeholder,
} from "@/features/create-project/domain/stakeholders";
import { User } from "@/features/users/domain/user";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import LocalAuthoritySelect from "@/shared/views/components/form/LocalAuthoritySelect";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteStakeholders: SiteStakeholder[];
  currentUserCompany: Exclude<User["organization"], undefined>;
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
  currentUserCompany: Props["currentUserCompany"],
  currentSiteOwner?: SiteStakeholder,
): boolean => isCurrentUserSameSiteStakeholderEntity(currentUserCompany, currentSiteOwner);

const isCurrentUserSiteTenant = (
  currentUserCompany: Props["currentUserCompany"],
  currentSiteTenant: SiteStakeholder,
): boolean => isCurrentUserSameSiteStakeholderEntity(currentUserCompany, currentSiteTenant);

function FutureSiteOwnerForm({
  onSubmit,
  currentUserCompany,
  siteStakeholders,
  projectSiteLocalAuthorities,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedFutureOperator = watch("futureSiteOwner");

  const currentSiteOwner = siteStakeholders.find(({ role }) => role === "site_owner");
  const currentSiteTenant = siteStakeholders.find(({ role }) => role === "site_tenant");

  const shouldDisplayCurrentUserCompanyOption = !isCurrentUserSiteOwner(
    currentUserCompany,
    currentSiteOwner,
  );

  const shouldDisplaySiteTenantOption =
    currentSiteTenant && !isCurrentUserSiteTenant(currentUserCompany, currentSiteTenant);

  const localAuthoritiesExcludedValues = getLocalAuthoritiesExcludedValues(
    currentUserCompany,
    siteStakeholders,
  );

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
              label={currentUserCompany.name}
              value="user_company"
              {...register("futureSiteOwner", { required: requiredMessage })}
            />
          )}

          {shouldDisplaySiteTenantOption && (
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
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default FutureSiteOwnerForm;
