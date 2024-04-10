import { useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { UserStructureActivity } from "../../domain/user";

import PolitiqueConfidentialiteContent from "@/shared/app-settings/views/PolitiqueConfidentialiteContent/PolitiqueConfidentialiteContent";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

const modal = createModal({
  id: "terms-modal",
  isOpenedByDefault: false,
});

export type FormValues = {
  lastname: string;
  firstname: string;
  email: string;
  structureActivity: UserStructureActivity;
  structureName?: string;
  personnalDataUseConsentment: "agreed";
};

type Props = {
  createUserLoadingState: "idle" | "loading" | "success" | "error";
  onSubmit: (data: FormValues) => void;
};

const structureActivityLabelMap = new Map<UserStructureActivity, string>([
  ["urban_planner", "Aménageur urbain"],
  ["real_estate_developer", "Promoteur"],
  ["local_authority_landlord", "Bailleur social"],
  ["local_authority", "Collectivité"],
  ["photovoltaic_plants_developer", "Développeur de centrale photovoltaïque"],
  ["industrialist", "Industriel"],
  ["other", "Autre"],
]);

const structureActivityOptions = Array.from(structureActivityLabelMap).map(([value, label]) => ({
  value,
  label,
}));

function CreateUserForm({ onSubmit, createUserLoadingState }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <WizardFormLayout title="Avant de commencer...">
        <p>... nous avons besoin de connaître quelques informations sur vous.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4>Votre identité</h4>
          <Input
            label={<RequiredLabel label="Email" />}
            state={formState.errors.email ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.email ? formState.errors.email.message : undefined
            }
            nativeInputProps={{
              placeholder: "utilisateur@ademe.fr",
              ...register("email", {
                required: "Vous devez renseigner votre e-mail pour continuer.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Veuillez entrer une adresse email valide.",
                },
              }),
            }}
          />
          <Input
            label="Nom"
            nativeInputProps={{ ...register("lastname"), placeholder: "Chateau" }}
          />
          <Input
            label="Prénom"
            nativeInputProps={{ ...register("firstname"), placeholder: "Laurent" }}
          />
          <h4>Votre structure</h4>
          <Select
            className={fr.cx("fr-col-6")}
            label={<RequiredLabel label="Profil" />}
            placeholder="Collectivité, aménageur urbain..."
            state={formState.errors.structureActivity ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.structureActivity
                ? formState.errors.structureActivity.message
                : undefined
            }
            nativeSelectProps={{
              ...register("structureActivity", {
                required: "Vous devez sélectionner un type de profil pour continuer",
              }),
            }}
            options={structureActivityOptions}
          />
          <Input
            label="Nom de la structure"
            nativeInputProps={{
              placeholder: "La région Auvergne-Rhône-Alpes",
              ...register("structureName"),
            }}
          />
          <Checkbox
            state={formState.errors.personnalDataUseConsentment ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.personnalDataUseConsentment
                ? formState.errors.personnalDataUseConsentment.message
                : undefined
            }
            options={[
              {
                label: "J'ai lu et j'accepte la politique de confidentialité de Bénéfriches",
                nativeInputProps: {
                  value: "agreed",
                  ...register("personnalDataUseConsentment", {
                    required: "Vous devez accepter la politique de confidentialité pour continuer.",
                  }),
                },
              },
            ]}
          />
          {createUserLoadingState === "error" && (
            <Alert
              description="Une erreur s'est produite lors de la sauvegarde des données... Veuillez réessayer."
              severity="error"
              title="Échec de l'enregistrement"
              className="fr-my-7v"
            />
          )}

          <ButtonsGroup
            inlineLayoutWhen="always"
            buttons={[
              {
                children: createUserLoadingState === "loading" ? "Chargement..." : "Commencer",
                type: "submit",
                disabled: createUserLoadingState === "loading",
              },
              {
                children: "Lire la politique de confidentialité",
                priority: "secondary",
                type: "button",
                onClick: () => {
                  modal.open();
                },
              },
            ]}
          />
        </form>

        <modal.Component
          size="large"
          title="Politique de confidentialité"
          buttons={[
            {
              children: "C'est compris",
              type: "button",
            },
          ]}
        >
          <PolitiqueConfidentialiteContent />
        </modal.Component>
      </WizardFormLayout>
    </section>
  );
}

export default CreateUserForm;
