import Alert from "@codegouvfr/react-dsfr/Alert";
import { Input } from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { AutoComplete } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { formatLocalAuthorityName, LocalAuthority } from "shared";

import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";

import { AdministrativeDivision, AdministrativeDivisionService } from ".";
import { UserStructureActivity } from "../../domain/user";
import { FormValues } from "./CreateUserForm";

type StructureCategory = Exclude<UserStructureActivity, LocalAuthority> | "local_authority";

type Municipality = {
  label: AdministrativeDivision["name"];
  value: AdministrativeDivision["code"];
  localAuthorities: AdministrativeDivision["localAuthorities"];
};

export type StructureFormValues =
  | {
      structureCategory: Exclude<UserStructureActivity, LocalAuthority>;
      structureName: string;
      structureMunicipalityText: undefined;
      selectedStructureMunicipality: undefined;
      selectedStructureLocalAuthorityType: undefined;
    }
  | {
      structureCategory: "local_authority";
      structureMunicipalityText?: string;
      selectedStructureMunicipality?: Municipality;
      selectedStructureLocalAuthorityType: LocalAuthority;
      structureName: string;
    };

type Props = {
  formContext: UseFormReturn<FormValues>;
  administrativeDivisionService: AdministrativeDivisionService;
};

const structureActivityLabelMap = new Map<StructureCategory, string>([
  ["local_authority", "Collectivité"],
  ["local_authority_landlord", "Bailleur social"],
  ["real_estate_developer", "Promoteur"],
  ["photovoltaic_plants_developer", "Développeur photovoltaïque"],
  ["industrialist", "Industriel"],
  ["other", "Autre"],
]);

const DEFAULT_LOCAL_AUTHORITIES = [
  {
    type: "municipality",
    name: "Mairie",
  },
  {
    type: "epci",
    name: "Établissement public de coopération intercommunale",
  },
  {
    type: "department",
    name: "Département",
  },
  {
    type: "region",
    name: "Région",
  },
];

const structureActivityOptions = Array.from(structureActivityLabelMap).map(([value, label]) => ({
  value,
  label,
}));

function UserStructureForm({ administrativeDivisionService, formContext }: Props) {
  const { watch, register, unregister, setValue, formState } = formContext;
  const structureCategory = watch("structureCategory");
  const selectedStructureMunicipality = watch("selectedStructureMunicipality");
  const structureMunicipalityText = watch("structureMunicipalityText");
  const selectedStructureLocalAuthorityType = watch("selectedStructureLocalAuthorityType");

  const [suggestions, setSuggestions] = useState<Municipality[]>([]);
  const [externalServiceError, setExternalServiceError] = useState<boolean>(false);

  const onSearch = async (text: string) => {
    if (text.length <= 3) {
      return;
    }
    try {
      const options = await administrativeDivisionService.searchMunicipality(text);
      setSuggestions(
        options.map((municipality) => ({
          value: municipality.code,
          label: municipality.name,
          localAuthorities: municipality.localAuthorities,
        })),
      );
      setExternalServiceError(false);
    } catch {
      setExternalServiceError(true);
    }
  };

  useEffect(() => {
    if (structureCategory === "local_authority") {
      register("selectedStructureMunicipality", {
        required: externalServiceError
          ? false
          : "La commune est nécessaire pour déterminer le nom de votre collectivité",
      });
      return;
    }

    unregister([
      "selectedStructureMunicipality",
      "selectedStructureLocalAuthorityType",
      "structureMunicipalityText",
    ]);
    setValue("structureName", "");
  }, [externalServiceError, register, setValue, structureCategory, unregister]);

  useEffect(() => {
    if (!selectedStructureMunicipality) {
      return;
    }

    const selectedStructureLocalAuthority = selectedStructureMunicipality.localAuthorities.find(
      ({ type }) => type === selectedStructureLocalAuthorityType,
    );

    if (!selectedStructureLocalAuthority) {
      return;
    }

    setValue(
      "structureName",
      formatLocalAuthorityName(
        selectedStructureLocalAuthority.type,
        selectedStructureLocalAuthority.name,
      ),
    );
  }, [selectedStructureLocalAuthorityType, selectedStructureMunicipality, setValue]);

  return (
    <>
      <Select
        label={<RequiredLabel label="Type de structure" />}
        placeholder="Sélectionner une structure..."
        state={formState.errors.structureCategory ? "error" : "default"}
        stateRelatedMessage={
          formState.errors.structureCategory
            ? formState.errors.structureCategory.message
            : undefined
        }
        nativeSelectProps={{
          ...register("structureCategory", {
            required: "Vous devez sélectionner un type de structure pour continuer",
          }),
        }}
        options={structureActivityOptions}
      />
      {structureCategory === "local_authority" ? (
        <>
          <AutoComplete
            className="tw-mb-16 tw-w-full"
            value={selectedStructureMunicipality?.value}
            options={suggestions}
            onSearch={onSearch}
            onSelect={(_: string, option: Municipality) => {
              setValue("selectedStructureMunicipality", option, { shouldValidate: true });
              setValue("structureMunicipalityText", option.label);
            }}
          >
            <Input
              label={<RequiredLabel label="Commune ou code postal" />}
              state={formState.errors.selectedStructureMunicipality ? "error" : "default"}
              stateRelatedMessage={
                formState.errors.selectedStructureMunicipality
                  ? formState.errors.selectedStructureMunicipality.message
                  : undefined
              }
              nativeInputProps={{
                placeholder: "38000, Angers...",
                value: structureMunicipalityText ?? "",
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  setValue("structureMunicipalityText", e.target.value);
                  setValue("selectedStructureMunicipality", undefined);
                },
              }}
            />
          </AutoComplete>
          {selectedStructureMunicipality && (
            <Select
              options={selectedStructureMunicipality.localAuthorities.map(({ type, name }) => ({
                label: formatLocalAuthorityName(type, name),
                value: type,
              }))}
              label={<RequiredLabel label="Nom de la collectivité" />}
              placeholder="Sélectionnez la collectivité"
              state={formState.errors.selectedStructureLocalAuthorityType ? "error" : "default"}
              stateRelatedMessage={formState.errors.selectedStructureLocalAuthorityType?.message}
              nativeSelectProps={register("selectedStructureLocalAuthorityType", {
                required: "Ce champ est requis",
              })}
            />
          )}

          {externalServiceError && (
            <>
              <Alert
                className="tw-mb-4"
                small
                severity="warning"
                title="Erreur de récupération des données"
                description="Nous n’avons pas pu récupérer automatiquement les collectivités associées à votre commune. Veuillez entrer manuellement le nom de votre collectivité."
              />

              <Select
                options={DEFAULT_LOCAL_AUTHORITIES.map(({ type, name }) => ({
                  label: name,
                  value: type,
                }))}
                label={<RequiredLabel label="Type de collectivité" />}
                placeholder="Sélectionnez le type de collectivité"
                state={formState.errors.selectedStructureLocalAuthorityType ? "error" : "default"}
                stateRelatedMessage={formState.errors.selectedStructureLocalAuthorityType?.message}
                nativeSelectProps={register("selectedStructureLocalAuthorityType", {
                  required: "Ce champ est requis",
                })}
              />
              <Input
                label={<RequiredLabel label="Nom de la structure" />}
                state={formState.errors.structureName ? "error" : "default"}
                stateRelatedMessage={formState.errors.structureName?.message}
                nativeInputProps={{
                  placeholder:
                    "Mairie de Blajan, Communauté de Communes Coeur et Coteaux du Comminges...",
                  ...register("structureName", {
                    required: "Le nom de votre structure est requis.",
                  }),
                }}
              />
            </>
          )}
        </>
      ) : (
        <Input
          label={<RequiredLabel label="Nom de la structure" />}
          state={formState.errors.structureName ? "error" : "default"}
          stateRelatedMessage={formState.errors.structureName?.message}
          nativeInputProps={{
            placeholder: "3F, Générale du Solaire, GreenCity...",
            ...register("structureName", {
              required: "Le nom de votre structure est requis.",
            }),
          }}
        />
      )}
    </>
  );
}

export default UserStructureForm;
