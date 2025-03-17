import { Input } from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useForm } from "react-hook-form";
import { LocalAuthority, SiteNature } from "shared";

import { UserStructure } from "@/features/onboarding/core/user";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  initialValues: FormValues | undefined;
  currentUserStructure?: UserStructure;
  localAuthoritiesList: { type: LocalAuthority; name: string }[];
  siteNature: SiteNature | undefined;
};

export type FormValues =
  | {
      ownerType: "user_structure";
      localAuthority: undefined;
      ownerName: undefined;
    }
  | {
      ownerType: "local_or_regional_authority";
      localAuthority: LocalAuthority;
      ownerName: undefined;
    }
  | {
      ownerType: "private_individual" | "other_company";
      ownerName: string;
      localAuthority: undefined;
    };

const requiredMessage = "Ce champ requis pour la suite du formulaire";

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Qui est le propriétaire actuel`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} de la friche`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} de l'exploitation`;
    case "NATURAL_AREA":
      return `${baseTitle} de l'espace naturel`;
    default:
      return `${baseTitle} du site`;
  }
};

function SiteOwnerForm({
  onSubmit,
  onBack,
  initialValues,
  currentUserStructure,
  localAuthoritiesList,
  siteNature,
}: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: initialValues,
  });

  const ownerTypeSelected = watch("ownerType");
  const shouldAskForPrivateName = ownerTypeSelected === "private_individual";
  const shouldAskForCompanyName = ownerTypeSelected === "other_company";
  const shouldAskForLocalAuthorityType = ownerTypeSelected === "local_or_regional_authority";

  return (
    <WizardFormLayout
      title={getTitle(siteNature)}
      instructions={
        <FormInfo>
          <p>
            Il n’est pas rare qu'un site ait plusieurs propriétaires (par exemple si elle est
            composée de plusieurs parcelles cadastrales ou alors si le bien immobilier est en
            indivision).
          </p>

          <p>
            Dans ce cas, il n’est pas attendu que la totalité des propriétaires soit renseigné,
            l’information utile pour Bénéfriches étant d’en désigner un (par exemple celui ayant la
            propriété de la plus grande parcelle), cette donnée étant utilisée pour affecter la
            partie des impacts correspondant à cette catégorie d’acteur.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.ownerType ? "error" : "default"}
          stateRelatedMessage={
            formState.errors.ownerType ? formState.errors.ownerType.message : undefined
          }
        >
          {currentUserStructure?.name && (
            <RadioButton
              label={
                currentUserStructure.type === "local_authority"
                  ? `Ma collectivité, ${currentUserStructure.name}`
                  : `Mon entreprise, ${currentUserStructure.name}`
              }
              value="user_structure"
              {...register("ownerType", { required: requiredMessage })}
            />
          )}
          <RadioButton
            label={
              currentUserStructure?.type === "local_authority"
                ? "Une autre collectivité"
                : "Une collectivité"
            }
            value="local_or_regional_authority"
            {...register("ownerType", { required: requiredMessage })}
          />

          {shouldAskForLocalAuthorityType && (
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

          <RadioButton
            label={
              <span className="tw-flex tw-items-center">
                {currentUserStructure?.type === "local_authority"
                  ? `Une entreprise`
                  : "Une autre entreprise"}
                <TooltipInfoButton
                  text="Entreprise publique ou privée, association, EPF..."
                  id="company-info"
                />
              </span>
            }
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
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteOwnerForm;
