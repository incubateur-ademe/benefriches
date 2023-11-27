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

type Props = {
  onSubmit: (data: FormValues) => void;
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
  [
    "municipality",
    "community_of_municipalities",
    "department",
    "region",
    "state",
  ] as const
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

const getOperatorOptions = (siteStakeholders: Props["siteStakeholders"]) => {
  return [
    {
      label: "Mon entreprise",
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
    {
      label: "Une collectivité",
      value: "local_or_regional_authority",
    },
    {
      label: "Une autre structure",
      value: "other_structure",
    },
    {
      label: "NSP",
      value: "unknown",
    },
  ];
};

function SiteReinstatementContractOwnerForm({
  onSubmit,
  siteStakeholders,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedFutureOperator = watch("futureOperator");

  return (
    <>
      <h2>
        Qui sera le maître d’ouvrage des travaux de remise en état de la friche
        ?
      </h2>
      <p>
        Les travaux de remise en état incluent la désimperméabilisation des
        sols, la dépollution, l’enlèvement des déchets, la déconstruction, etc.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={getOperatorOptions(siteStakeholders)}
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
        {selectedFutureOperator === "other_structure" && (
          <Input
            label="Nom de la structure"
            nativeInputProps={register("otherStructureName", {
              required: "Ce champ est requis",
            })}
          />
        )}
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
    </>
  );
}

export default SiteReinstatementContractOwnerForm;
