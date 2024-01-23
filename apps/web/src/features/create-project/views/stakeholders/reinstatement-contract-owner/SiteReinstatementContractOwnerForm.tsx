import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import { SiteStakeholder } from "@/features/create-project/domain/stakeholders";
import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  currentUserCompany: string;
  siteStakeholders: SiteStakeholder[];
};
type FutureOperatorOption =
  | "user_company"
  | "site_stakeholder"
  | "site_owner"
  | "local_or_regional_authority"
  | "other_structure"
  | "unknown";

type SiteStakholderOption = SiteStakeholder["role"];

const localAndRegionalAuthorityOptions = (
  ["municipality", "community_of_municipalities", "department", "region", "state"] as const
).map((localOrRegionalAuthority) => ({
  label: getLabelForLocalOrRegionalAuthority(localOrRegionalAuthority),
  value: localOrRegionalAuthority,
}));

export type FormValues = {
  futureOperator: FutureOperatorOption;
  siteStakeholder?: SiteStakholderOption;
  localOrRegionalAuthority?: LocalAndRegionalAuthority;
  otherStructureName?: string;
};

const requiredMessage = "Champ requis";

const getSiteRelatedOperatorOptions = (
  siteStakeholders: Props["siteStakeholders"],
  currentUserCompany: string,
) => {
  return [
    {
      label: `Mon entreprise, ${currentUserCompany}`,
      value: "user_company",
    },
    siteStakeholders.length > 1
      ? {
          label: "Un acteur du site existant",
          value: "site_stakeholder",
        }
      : {
          label: siteStakeholders[0]!.name,
          value: siteStakeholders[0]!.role,
        },
  ];
};

function SiteReinstatementContractOwnerForm({
  onSubmit,
  currentUserCompany,
  siteStakeholders,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedFutureOperator = watch("futureOperator");

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

          {selectedFutureOperator === "site_stakeholder" && (
            <Select
              label="Acteur du site existant"
              placeholder="Sélectionnez l'acteur du site existant"
              nativeSelectProps={register("siteStakeholder", {
                required: "Ce champ est requis",
              })}
              state={formState.errors.siteStakeholder ? "error" : "default"}
              stateRelatedMessage={formState.errors.siteStakeholder?.message}
              options={siteStakeholders.map(({ name, role }) => ({
                label: name,
                value: role,
              }))}
            />
          )}
          <RadioButton
            label="Une collectivité"
            value="local_or_regional_authority"
            {...register("futureOperator", { required: requiredMessage })}
          />

          {selectedFutureOperator === "local_or_regional_authority" && (
            <Select
              label="Type de collectivité"
              placeholder="Sélectionnez un type de collectivité"
              state={formState.errors.localOrRegionalAuthority ? "error" : "default"}
              stateRelatedMessage={formState.errors.localOrRegionalAuthority?.message}
              nativeSelectProps={register("localOrRegionalAuthority", {
                required: "Ce champ est requis",
              })}
              options={localAndRegionalAuthorityOptions}
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
            label="NSP"
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
