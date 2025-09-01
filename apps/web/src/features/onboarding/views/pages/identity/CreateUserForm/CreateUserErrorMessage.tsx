import Alert from "@codegouvfr/react-dsfr/Alert";
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton";

import { authLinkModal } from "../../access-benefriches/createAuthLinkModal";

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
              L'adresse e-mail fournie est déjà utilisée. Veuillez vous connecter avec Pro Connect.
            </p>
            <ProConnectButton url="/api/auth/login/pro-connect" />
            <span>
              <a
                href="#"
                role="button"
                onClick={() => {
                  authLinkModal.open();
                }}
                className="text-sm"
              >
                Vous n'avez pas de compte Pro Connect ? Recevez un lien de connexion par mail.
              </a>
            </span>
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
