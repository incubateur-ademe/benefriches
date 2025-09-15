import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useForm } from "react-hook-form";

import PolitiqueConfidentialiteContent from "@/shared/views/components/PolitiqueConfidentialiteContent/PolitiqueConfidentialiteContent";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { AdministrativeDivisionService } from ".";
import AuthLinkModal from "../../access-benefriches/AuthLinkModal";
import CreateUserErrorMessage from "./CreateUserErrorMessage";
import UserStructureForm, { StructureFormValues } from "./CreateUserStructureForm";

const modal = createModal({
  id: "terms-modal",
  isOpenedByDefault: false,
});

export type FormValues = {
  lastname: string;
  firstname: string;
  email: string;
  personnalDataUseConsentment: "agreed";
  subscribedToNewsletter: "agreed" | undefined;
} & StructureFormValues;

type Props = {
  predefinedValues?: Partial<FormValues>;
  createUserLoadingState: "idle" | "loading" | "success" | "error";
  createUserError?: string;
  onSubmit: (data: FormValues) => void;
  administrativeDivisionService: AdministrativeDivisionService;
};

function CreateUserForm({
  onSubmit,
  createUserLoadingState,
  createUserError,
  administrativeDivisionService,
  predefinedValues,
}: Props) {
  const formContext = useForm<FormValues>({
    defaultValues: predefinedValues,
  });
  const { register, handleSubmit, formState } = formContext;

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
            disabled={predefinedValues?.email !== undefined}
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
            label="Prénom"
            nativeInputProps={{ ...register("firstname"), placeholder: "Laurent" }}
            disabled={predefinedValues?.firstname !== undefined}
          />
          <Input
            label="Nom"
            nativeInputProps={{ ...register("lastname"), placeholder: "Chateau" }}
            disabled={predefinedValues?.lastname !== undefined}
          />
          <UserStructureForm
            administrativeDivisionService={administrativeDivisionService}
            formContext={formContext}
          />
          <Checkbox
            className="mb-6"
            state={formState.errors.personnalDataUseConsentment ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.personnalDataUseConsentment
                ? formState.errors.personnalDataUseConsentment.message
                : undefined
            }
            options={[
              {
                label:
                  "J'ai lu et j'accepte que l'ADEME collecte mes données afin de garantir la bonne utilisation des services offerts par la plateforme Bénéfriches et je reconnais avoir pris connaissance de sa politique de protection des données personnelles.",
                nativeInputProps: {
                  value: "agreed",
                  ...register("personnalDataUseConsentment", {
                    required: "Vous devez accepter la politique de confidentialité pour continuer.",
                  }),
                },
              },
            ]}
          />
          <Checkbox
            className="mb-6"
            options={[
              {
                label:
                  "Je souhaite recevoir la newsletter Bénéfriches, incluant les évolutions produit, cas d'usage et événements",
                nativeInputProps: {
                  value: "agreed",
                  ...register("subscribedToNewsletter"),
                },
              },
            ]}
          />
          {createUserLoadingState === "error" && (
            <div className="mb-6">
              <CreateUserErrorMessage errorKind={createUserError ?? ""} />
            </div>
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

        <AuthLinkModal />
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
