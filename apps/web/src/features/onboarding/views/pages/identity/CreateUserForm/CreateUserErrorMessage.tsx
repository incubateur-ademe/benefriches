import Alert from "@codegouvfr/react-dsfr/Alert";

import { routes } from "@/shared/views/router";

type Props = {
  errorKind: string;
};

export default function CreateUserErrorMessage({ errorKind }: Props) {
  if (errorKind === "EMAIL_ALREADY_EXISTS") {
    return (
      <Alert
        severity="warning"
        title="Impossible de créer le compte"
        description={
          <div>
            <p className="mb-4">
              L'adresse e-mail fournie est déjà utilisée.{" "}
              <span>
                Veuillez{" "}
                <a className="text-sm font-medium" {...routes.accessBenefriches().link}>
                  vous identifier via Pro Connect ou votre email
                </a>
                .
              </span>
            </p>
          </div>
        }
      />
    );
  }

  return (
    <Alert
      description="Une erreur s'est produite lors de la création de votre compte... Veuillez réessayer."
      severity="error"
      title="Échec de l'enregistrement"
      className="my-7"
    />
  );
}
