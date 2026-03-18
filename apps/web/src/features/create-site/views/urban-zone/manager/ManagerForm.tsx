import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useForm } from "react-hook-form";
import type { LocalAuthority } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type ManagerStructureType = "activity_park_manager" | "local_authority";

type FormValues = {
  structureType: ManagerStructureType | null;
  localAuthority: LocalAuthority | "";
};

type Props = {
  initialValues: {
    structureType: ManagerStructureType | undefined;
    localAuthority: LocalAuthority | undefined;
  };
  localAuthoritiesList: { type: LocalAuthority; name: string }[];
  onSubmit: (
    data:
      | { structureType: "activity_park_manager" }
      | {
          structureType: "local_authority";
          localAuthority: LocalAuthority;
          localAuthorityName: string;
        },
  ) => void;
  onBack: () => void;
};

function ManagerForm({ initialValues, localAuthoritiesList, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      structureType: initialValues.structureType ?? null,
      localAuthority: initialValues.localAuthority ?? "",
    },
  });

  const structureTypeError = formState.errors.structureType;
  const structureTypeValue = watch("structureType");

  return (
    <WizardFormLayout title="Qui est le gestionnaire de la zone commerciale ?">
      <form
        onSubmit={handleSubmit(({ structureType, localAuthority }) => {
          if (!structureType) return;
          if (structureType === "local_authority" && localAuthority) {
            const localAuthorityName =
              localAuthoritiesList.find((la) => la.type === localAuthority)?.name ?? "";
            onSubmit({ structureType, localAuthority, localAuthorityName });
          } else {
            onSubmit({ structureType: "activity_park_manager" });
          }
        })}
      >
        <Fieldset
          state={structureTypeError ? "error" : "default"}
          stateRelatedMessage={structureTypeError ? structureTypeError.message : undefined}
        >
          <RadioButton
            label="Un gestionnaire de parc d'activité"
            value="activity_park_manager"
            {...register("structureType", {
              required: "Veuillez sélectionner un type de gestionnaire.",
            })}
          />
          <RadioButton
            label="Une collectivité"
            value="local_authority"
            {...register("structureType")}
          />

          {structureTypeValue === "local_authority" && (
            <Select
              options={localAuthoritiesList.map(({ type, name }) => ({
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
        </Fieldset>

        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={structureTypeValue !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default ManagerForm;
