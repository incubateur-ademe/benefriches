import Alert from "@codegouvfr/react-dsfr/Alert";
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton";

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
            <p className="tw-mb-4">
              L'adresse e-mail fournie est déjà utilisée. Veuillez vous connecter avec Pro Connect.
            </p>
            <ProConnectButton url="/api/auth/login/pro-connect" />
            <span className="tw-mt-4">
              <a href="#" className="tw-text-sm">
                Vous n'avez pas de compte Pro Connect ?
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
      className="tw-my-7"
    />
  );
}
