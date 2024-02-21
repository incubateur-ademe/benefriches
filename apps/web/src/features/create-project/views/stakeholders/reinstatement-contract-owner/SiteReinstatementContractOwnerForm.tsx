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
  currentUserCompany: Exclude<User["organization"], undefined>;
  siteStakeholders: SiteStakeholder[];
  projectSiteLocalAuthorities: ProjectSiteLocalAuthoritiesState;
};

export type FormValues =
  | {
      futureOperator: "local_or_regional_authority";
      localAuthority: LocalAutorityStructureType;
      otherStructureName: undefined;
    }
  | {
      futureOperator: "other_structure";
      otherStructureName: string;
      localAuthority: undefined;
    }
  | {
      futureOperator: "user_company" | "site_tenant" | "site_owner" | "unknown";
      localAuthority: undefined;
      otherStructureName: undefined;
    };

const requiredMessage = "Ce champ est requis";

const getSiteRelatedOperatorOptions = (
  siteStakeholders: Props["siteStakeholders"],
  currentUserCompany: Props["currentUserCompany"],
) => {
  return [
    {
      label: currentUserCompany.name,
      value: "user_company",
    },
    ...siteStakeholders
      .filter(
        (stakeholder) => !isCurrentUserSameSiteStakeholderEntity(currentUserCompany, stakeholder),
      )
      .map(({ name, role }) => ({
        label: name,
        value: role,
      })),
  ];
};

function SiteReinstatementContractOwnerForm({
  onSubmit,
  currentUserCompany,
  siteStakeholders,
  projectSiteLocalAuthorities,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedFutureOperator = watch("futureOperator");

  const localAuthoritiesExcludedValues = getLocalAuthoritiesExcludedValues(
    currentUserCompany,
    siteStakeholders,
  );

  return (
    <WizardFormLayout
      title="Qui sera le maître d’ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <p>
          Les travaux de remise en état incluent la désimperméabilisation des sols, la dépollution,
          l’enlèvement des déchets, la déconstruction, etc.
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.futureOperator ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.futureOperator ? formState.errors.futureOperator.message : undefined
          }
        >
          {getSiteRelatedOperatorOptions(siteStakeholders, currentUserCompany).map(
            ({ label, value }) => (
              <RadioButton
                label={label}
                value={value}
                key={value}
                {...register("futureOperator", { required: requiredMessage })}
              />
            ),
          )}

          <RadioButton
            label={
              localAuthoritiesExcludedValues.length > 0
                ? "Une autre collectivité"
                : "Une collectivité"
            }
            value="local_or_regional_authority"
            {...register("futureOperator", { required: requiredMessage })}
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
            {...register("futureOperator", { required: requiredMessage })}
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
            {...register("futureOperator", { required: requiredMessage })}
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

export default SiteReinstatementContractOwnerForm;
