import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";

import {
  getLabelForLocalOrRegionalAuthority,
  LocalAndRegionalAuthority,
} from "@/shared/domain/localOrRegionalAuthority";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  currentUserCompany: string;
};

export type FormValues =
  | {
      ownerType: "user_company";
      localAndRegionalAuthorityType: undefined;
      ownerName: undefined;
    }
  | {
      ownerType: "local_or_regional_authority";
      localAndRegionalAuthorityType: LocalAndRegionalAuthority;
      ownerName: undefined;
    }
  | {
      ownerType: "private_individual" | "other_company";
      ownerName: string;
      localAndRegionalAuthorityType: undefined;
    };

const localAndRegionalAuthorityOptions = (
  ["municipality", "community_of_municipalities", "department", "region", "state"] as const
).map((localOrRegionalAuthority) => ({
  label: getLabelForLocalOrRegionalAuthority(localOrRegionalAuthority),
  value: localOrRegionalAuthority,
}));

const requiredMessage = "Ce champ requis pour la suite du formulaire";

function SiteOwnerForm({ onSubmit, currentUserCompany }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const ownerTypeSelected = watch("ownerType");
  const shouldAskForPrivateName = ownerTypeSelected === "private_individual";
  const shouldAskForCompanyName = ownerTypeSelected === "other_company";
  const shouldAskForLocalOrAuthorityType = ownerTypeSelected === "local_or_regional_authority";

  return (
    <WizardFormLayout title="Qui est le propriétaire actuel de cette friche ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.ownerType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.ownerType ? formState.errors.ownerType.message : undefined
          }
        >
          <RadioButton
            label="La collectivité"
            value="local_or_regional_authority"
            {...register("ownerType", { required: requiredMessage })}
          />

          {shouldAskForLocalOrAuthorityType && (
            <Select
              label={<RequiredLabel label="Type de collectivité" />}
              placeholder="Sélectionnez un type de collectivité"
              state={formState.errors.localAndRegionalAuthorityType ? "error" : "default"}
              stateRelatedMessage={formState.errors.localAndRegionalAuthorityType?.message}
              nativeSelectProps={register("localAndRegionalAuthorityType", {
                required: "Ce champ est requis",
              })}
              options={localAndRegionalAuthorityOptions}
            />
          )}
          <RadioButton
            label={`Mon entreprise, ${currentUserCompany}`}
            value="user_company"
            {...register("ownerType", { required: requiredMessage })}
          />

          <RadioButton
            label={`Une autre entreprise`}
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

export default SiteOwnerForm;
