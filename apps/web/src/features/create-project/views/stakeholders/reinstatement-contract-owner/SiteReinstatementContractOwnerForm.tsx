import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";

import { SiteStakeholder } from "@/features/create-project/domain/stakeholders";
import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
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
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={getSiteRelatedOperatorOptions(siteStakeholders, currentUserCompany)}
          error={formState.errors.futureOperator}
        />
        {selectedFutureOperator === "site_stakeholder" && (
          <Select
            label="Acteur du site existant"
            placeholder="Sélectionnez l'acteur du site existant"
            nativeSelectProps={register("siteStakeholder", {
              required: "Ce champ est requis",
            })}
            options={siteStakeholders.map(({ name, role }) => ({
              label: name,
              value: role,
            }))}
          />
        )}
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={[
            {
              label: "Une collectivité",
              value: "local_or_regional_authority",
            },
          ]}
          error={formState.errors.futureOperator}
        />
        {selectedFutureOperator === "local_or_regional_authority" && (
          <Select
            label="Type de collectivité"
            placeholder="Sélectionnez un type de collectivité"
            nativeSelectProps={register("localOrRegionalAuthority", {
              required: "Ce champ est requis",
            })}
            options={localAndRegionalAuthorityOptions}
          />
        )}
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={[
            {
              label: "Une autre structure",
              value: "other_structure",
            },
          ]}
          error={formState.errors.futureOperator}
        />
        {selectedFutureOperator === "other_structure" && (
          <Input
            label="Nom de la structure"
            nativeInputProps={register("otherStructureName", {
              required: "Ce champ est requis",
            })}
          />
        )}
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={[
            {
              label: "NSP",
              value: "unknown",
            },
          ]}
          error={formState.errors.futureOperator}
        />
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
